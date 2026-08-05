# Spec: User Notification Preference System

**Status:** DRAFT — awaiting approval before any code changes  
**Service:** `notification-service` (new microservice)  
**Author:** Lead Full-Stack Architect  
**Date:** 2026-07-31

---

## 1. Context & Architecture Decision

The codebase has no `src/user/` or `src/notifications/` directories. User data is
split across two existing services:

- **auth-service** (`com.nixtap.authservice`) — owns the `User` entity, authentication, JWT issuance.
- **profile-service** (`com.nixtap.profileservice`) — owns `UserProfile`, personal data.

Every other domain (business cards, portfolio items) lives in its own dedicated
microservice. Following this established pattern, notification preferences will be
implemented as a **new `notification-service`** microservice on port **8085**,
registered with Eureka, and routed through the API gateway.

The JWT already carries `userId`, `email`, and `role` claims. The downstream filter
populates an `AuthenticatedUser(userId, email)` principal into `SecurityContextHolder`.
This is the only mechanism used for ownership enforcement — no extra DB lookup.

---

## 2. Acceptance Criteria

### AC-1 — Retrieve preferences
- `GET /api/v1/users/me/preferences` returns the notification preferences for the
  authenticated user.
- If no record exists yet, a default record is created on-the-fly and returned
  (email=`true`, sms=`false`, push=`false`).
- An unauthenticated request (missing/invalid JWT) returns **401 Unauthorized**.

### AC-2 — Update preferences
- `PUT /api/v1/users/me/preferences` updates all three channel toggles atomically.
- Request body must contain `emailEnabled`, `smsEnabled`, and `pushEnabled` (all
  required booleans).
- Malformed request (missing fields) returns **422 Unprocessable Entity** with a
  field-level error map.
- An unauthenticated request returns **401 Unauthorized**.
- The response body contains the full updated preference record.

### AC-3 — Ownership enforcement
- A user can only view and update **their own** preferences.
- `userId` is extracted exclusively from the verified JWT — it is **never** supplied
  as a request parameter or path variable.
- Attempting to access another user's data via any other path is impossible by design
  (no user-id-based GET/PUT endpoints exist publicly).

### AC-4 — Defaults
- `emailEnabled` defaults to `true`.
- `smsEnabled` defaults to `false`.
- `pushEnabled` defaults to `false`.
- Defaults are set at the JPA entity level via `@Builder.Default`, consistent with
  `User.java` and `UserProfile.java` in the existing codebase.

### AC-5 — Gateway routing
- All requests to `/notification-service/**` through the API gateway are proxied to
  `lb://NOTIFICATION-SERVICE` with `StripPrefix=1`.

### AC-6 — Response envelope
- Both endpoints wrap their payload in `ApiResponse<T>` (`success`, `message`, `data`,
  `timestamp`), identical to every other service in the project.

---

## 3. Technical Design

### 3.1 Database Schema

**Database:** `notification_db` (new, separate from other services — consistent with
`auth_db`, `portfolio_db`, `nixtap_db`).

**Migration strategy:** `spring.jpa.hibernate.ddl-auto=update` — no Flyway/Liquibase,
matching every other service in the project.

```sql
CREATE TABLE notification_preferences (
    id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT          NOT NULL UNIQUE,          -- FK reference to auth-service users.id (logical, not enforced)
    email_enabled TINYINT(1)      NOT NULL DEFAULT 1,
    sms_enabled   TINYINT(1)      NOT NULL DEFAULT 0,
    push_enabled  TINYINT(1)      NOT NULL DEFAULT 0,
    created_at    DATETIME        NOT NULL,
    updated_at    DATETIME        NOT NULL,
    CONSTRAINT uq_notif_pref_user_id UNIQUE (user_id)
);
```

> Note: Cross-service foreign keys are not enforced at the DB level (consistent with
> all other services — e.g. `business_cards.user_id` has no FK to `users`).

### 3.2 JPA Entity

```java
// package: com.nixtap.notificationservice.entity

@Entity
@Table(name = "notification_preferences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "email_enabled", nullable = false)
    @Builder.Default
    private boolean emailEnabled = true;

    @Column(name = "sms_enabled", nullable = false)
    @Builder.Default
    private boolean smsEnabled = false;

    @Column(name = "push_enabled", nullable = false)
    @Builder.Default
    private boolean pushEnabled = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### 3.3 API Contract

#### GET /api/v1/users/me/preferences

**Request Headers:**
```
Authorization: Bearer <jwt>
```

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Notification preferences retrieved successfully",
  "data": {
    "userId": 42,
    "emailEnabled": true,
    "smsEnabled": false,
    "pushEnabled": false,
    "updatedAt": "2026-07-31T10:00:00"
  },
  "timestamp": "2026-07-31T10:00:00.123"
}
```

**Response 401 Unauthorized** (missing/invalid JWT):
```json
{
  "timestamp": "2026-07-31T10:00:00.123",
  "status": 401,
  "message": "Authentication required.",
  "path": "/api/v1/users/me/preferences",
  "errorCode": "UNAUTHORIZED"
}
```

---

#### PUT /api/v1/users/me/preferences

**Request Headers:**
```
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Request Body:**
```json
{
  "emailEnabled": true,
  "smsEnabled": true,
  "pushEnabled": false
}
```

| Field          | Type    | Required | Constraints              |
|----------------|---------|----------|--------------------------|
| `emailEnabled` | boolean | yes      | must be non-null         |
| `smsEnabled`   | boolean | yes      | must be non-null         |
| `pushEnabled`  | boolean | yes      | must be non-null         |

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "data": {
    "userId": 42,
    "emailEnabled": true,
    "smsEnabled": true,
    "pushEnabled": false,
    "updatedAt": "2026-07-31T10:05:00"
  },
  "timestamp": "2026-07-31T10:05:00.456"
}
```

**Response 422 Unprocessable Entity** (validation failure):
```json
{
  "timestamp": "2026-07-31T10:05:00.456",
  "status": 422,
  "message": "{emailEnabled=must not be null}",
  "path": "/api/v1/users/me/preferences",
  "errorCode": "VALIDATION_FAILED"
}
```

### 3.4 DTO Contracts

**NotificationPreferenceRequest** (PUT body):
```java
@Data
public class NotificationPreferenceRequest {
    @NotNull(message = "emailEnabled must not be null")
    private Boolean emailEnabled;

    @NotNull(message = "smsEnabled must not be null")
    private Boolean smsEnabled;

    @NotNull(message = "pushEnabled must not be null")
    private Boolean pushEnabled;
}
```

> `Boolean` (boxed) is used instead of `boolean` (primitive) so that `@NotNull`
> validation fires on a missing field rather than silently defaulting to `false`.

**NotificationPreferenceResponse** (GET/PUT response body inside `ApiResponse.data`):
```java
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class NotificationPreferenceResponse {
    private Long userId;
    private boolean emailEnabled;
    private boolean smsEnabled;
    private boolean pushEnabled;
    private LocalDateTime updatedAt;
}
```

### 3.5 Security Model

- The `/api/v1/users/me/preferences` path is fully authenticated — no public variant.
- `userId` is sourced **only** from `AuthenticatedUser.getUserId()` extracted from the
  `SecurityContext` — identical to the pattern in `UserProfileServiceImpl` and
  `BusinessCardServiceImpl`.
- The `SecurityConfig` permits only Swagger + Actuator health/info publicly; all other
  requests require a valid JWT.

### 3.6 Error Codes

| Scenario                      | HTTP Status | errorCode              |
|-------------------------------|-------------|------------------------|
| Missing/invalid JWT           | 401         | `UNAUTHORIZED`         |
| Validation failure            | 422         | `VALIDATION_FAILED`    |
| Preferences record not found  | 404         | `PREFERENCES_NOT_FOUND`|
| Unexpected server error       | 500         | `INTERNAL_SERVER_ERROR`|

> Note: 404 for preferences is only possible through direct DB manipulation since the
> GET endpoint auto-creates defaults. It is still handled for defensive completeness.

---

## 4. Task Breakdown

All tasks are in `notification-service/` unless stated otherwise.
Execute **in order** — each task depends on the previous ones compiling.

---

### Phase 1 — Project Scaffolding

**Task 1: Create `notification-service` Maven project**
- File: `notification-service/pom.xml`
- Copy dependency set from `profile-service/pom.xml` exactly:
  Spring Boot 3.4.2, Spring Data JPA, Spring Security, Spring Web, Spring Validation,
  Spring Actuator, Eureka Client, MySQL Connector, Lombok 1.18.36, MapStruct 1.6.3,
  SpringDoc 2.8.5, JJWT 0.12.6, Spring Boot Test, Spring Security Test.
- Set port to **8085** in `application.yml`.
- New database: `notification_db`.

**Task 2: Create `application.yml`**
- File: `notification-service/src/main/resources/application.yml`
- Mirror `profile-service/application.yml` structure:
  env-var-based `${DB_PASSWORD}`, `${JWT_SECRET}`, `show-sql: false`,
  Eureka registration, SpringDoc paths.

**Task 3: Create main application class**
- File: `src/main/java/com/nixtap/notificationservice/NotificationServiceApplication.java`
- Standard `@SpringBootApplication` + `@EnableFeignClients` (future-proofing for
  inter-service calls).

---

### Phase 2 — Security Layer (copy-adapt from profile-service)

**Task 4: Create `JwtUtil`**
- File: `config/JwtUtil.java`
- Copy `profile-service/config/JwtUtil.java` exactly (same JWT parsing logic).
- Methods needed: `getEmailFromJwtToken`, `getRoleFromJwtToken`,
  `getUserIdFromJwtToken`, `validateJwtToken`.

**Task 5: Create `AuthenticatedUser`**
- File: `security/AuthenticatedUser.java`
- Copy `profile-service/security/AuthenticatedUser.java` exactly.
- Fields: `Long userId`, `String email`.

**Task 6: Create `JwtAuthenticationFilter`**
- File: `security/JwtAuthenticationFilter.java`
- Copy `profile-service/security/JwtAuthenticationFilter.java` exactly.
- Populates `AuthenticatedUser(userId, email)` as the `Authentication` principal.

**Task 7: Create `SecurityConfig`**
- File: `config/SecurityConfig.java`
- Copy `profile-service/config/SecurityConfig.java`.
- Permit list: `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`,
  `/actuator/health`, `/actuator/info`.
- All other requests require authentication (`anyRequest().authenticated()`).
- No public endpoints for preferences — both GET and PUT require a valid JWT.

---

### Phase 3 — Core Domain

**Task 8: Create `NotificationPreference` entity**
- File: `entity/NotificationPreference.java`
- Follow `UserProfile.java` pattern exactly.
- Fields: `id` (Long, IDENTITY), `userId` (Long, unique, not null), `emailEnabled`
  (`@Builder.Default = true`), `smsEnabled` (`@Builder.Default = false`),
  `pushEnabled` (`@Builder.Default = false`), `createdAt`, `updatedAt`.
- Full Lombok: `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`.

**Task 9: Create `NotificationPreferenceRepository`**
- File: `repository/NotificationPreferenceRepository.java`
- Extend `JpaRepository<NotificationPreference, Long>`.
- Derived queries: `Optional<NotificationPreference> findByUserId(Long userId)`,
  `boolean existsByUserId(Long userId)`.

---

### Phase 4 — DTOs

**Task 10: Create `NotificationPreferenceRequest`**
- File: `dto/request/NotificationPreferenceRequest.java`
- `@Data` class. Fields: `Boolean emailEnabled`, `Boolean smsEnabled`,
  `Boolean pushEnabled` — all with `@NotNull` + descriptive message.
- Use `Boolean` (boxed) not `boolean` (primitive) so `@NotNull` catches missing fields.

**Task 11: Create `NotificationPreferenceResponse`**
- File: `dto/response/NotificationPreferenceResponse.java`
- `@Data @Builder @AllArgsConstructor @NoArgsConstructor`.
- Fields: `Long userId`, `boolean emailEnabled`, `boolean smsEnabled`,
  `boolean pushEnabled`, `LocalDateTime updatedAt`.

**Task 12: Create `ApiResponse<T>`**
- File: `dto/response/ApiResponse.java`
- Exact copy of `profile-service/dto/response/ApiResponse.java`.
- Generic wrapper with `success`, `message`, `data`, `timestamp` + static factories.

**Task 13: Create `ErrorResponse`**
- File: `dto/response/ErrorResponse.java`
- Exact copy of `profile-service/dto/response/ErrorResponse.java`.
- Fields: `timestamp`, `status`, `message`, `path`, `errorCode`.

---

### Phase 5 — Mapper

**Task 14: Create `NotificationPreferenceMapper`**
- File: `mapper/NotificationPreferenceMapper.java`
- MapStruct `@Mapper(componentModel = "spring")` interface.
- `NotificationPreferenceResponse toResponse(NotificationPreference entity)`.
- No `toEntity` method — the service builds the entity directly (simpler, no
  ambiguous-mapping risk given defaults are set via `@Builder.Default`).

---

### Phase 6 — Service Layer

**Task 15: Create `NotificationPreferenceService` interface**
- File: `service/NotificationPreferenceService.java`
- Two methods:
  ```java
  NotificationPreferenceResponse getMyPreferences();
  NotificationPreferenceResponse updateMyPreferences(NotificationPreferenceRequest request);
  ```
- Note: no `userId` parameter — the service extracts it from `SecurityContextHolder`
  internally, matching the pattern in `UserProfileServiceImpl`.

**Task 16: Create `NotificationPreferenceServiceImpl`**
- File: `service/impl/NotificationPreferenceServiceImpl.java`
- `@Service @RequiredArgsConstructor @Transactional`.
- Private helper `getAuthenticatedUserId()` — exact copy from `UserProfileServiceImpl`.
- **`getMyPreferences()`**: find by userId; if not found, create default record
  (`NotificationPreference.builder().userId(userId).build()`) and save before
  returning. Use `@Transactional` (not readOnly) since it may write on first call.
- **`updateMyPreferences()`**: find or create record, set all three boolean fields
  from request, save and return response. `@Transactional`.

---

### Phase 7 — Exception Handling

**Task 17: Create `ResourceNotFoundException`**
- File: `exception/ResourceNotFoundException.java`
- `public class ResourceNotFoundException extends RuntimeException` — single
  String-arg constructor.

**Task 18: Create `GlobalExceptionHandler`**
- File: `exception/GlobalExceptionHandler.java`
- `@Slf4j @RestControllerAdvice`.
- Handlers: `ResourceNotFoundException` → 404 / `PREFERENCES_NOT_FOUND`;
  `MethodArgumentNotValidException` → 422 / `VALIDATION_FAILED` (field-level map);
  `Exception` → 500 / `INTERNAL_SERVER_ERROR` with generic safe message + internal
  log. Returns `ErrorResponse` builder pattern matching all other services.

---

### Phase 8 — Controller

**Task 19: Create `NotificationPreferenceController`**
- File: `controller/NotificationPreferenceController.java`
- `@RestController @RequestMapping("/api/v1/users/me/preferences") @RequiredArgsConstructor`.
- Swagger: `@Tag(name = "Notification Preferences", description = "...")`.
- `@GetMapping` → calls `service.getMyPreferences()` → 200 + `ApiResponse.success(...)`.
- `@PutMapping` → `@Valid @RequestBody` → calls `service.updateMyPreferences(request)`
  → 200 + `ApiResponse.success(...)`.
- No path variables. No `userId` in the request. Principal is resolved internally in
  the service.

---

### Phase 9 — API Gateway Route

**Task 20: Add gateway route for notification-service**
- File: `api-gateway/src/main/resources/application.properties`
- Append:
  ```properties
  spring.cloud.gateway.routes[4].id=notification-service
  spring.cloud.gateway.routes[4].uri=lb://NOTIFICATION-SERVICE
  spring.cloud.gateway.routes[4].predicates[0]=Path=/notification-service/**
  spring.cloud.gateway.routes[4].filters[0]=StripPrefix=1
  ```

---

### Phase 10 — Swagger / OpenAPI Config

**Task 21: Create `SwaggerConfig`**
- File: `config/SwaggerConfig.java`
- Copy `profile-service/config/SwaggerConfig.java` exactly.
- Configure Bearer JWT security scheme so Swagger UI can send the Authorization header.

---

## 5. File Creation Checklist

```
notification-service/
├── pom.xml                                                         [Task 1]
├── src/main/resources/
│   └── application.yml                                             [Task 2]
└── src/main/java/com/nixtap/notificationservice/
    ├── NotificationServiceApplication.java                         [Task 3]
    ├── config/
    │   ├── JwtUtil.java                                            [Task 4]
    │   ├── SecurityConfig.java                                     [Task 7]
    │   └── SwaggerConfig.java                                      [Task 21]
    ├── security/
    │   ├── AuthenticatedUser.java                                  [Task 5]
    │   └── JwtAuthenticationFilter.java                            [Task 6]
    ├── entity/
    │   └── NotificationPreference.java                             [Task 8]
    ├── repository/
    │   └── NotificationPreferenceRepository.java                   [Task 9]
    ├── dto/
    │   ├── request/
    │   │   └── NotificationPreferenceRequest.java                  [Task 10]
    │   └── response/
    │       ├── NotificationPreferenceResponse.java                 [Task 11]
    │       ├── ApiResponse.java                                    [Task 12]
    │       └── ErrorResponse.java                                  [Task 13]
    ├── mapper/
    │   └── NotificationPreferenceMapper.java                       [Task 14]
    ├── service/
    │   ├── NotificationPreferenceService.java                      [Task 15]
    │   └── impl/
    │       └── NotificationPreferenceServiceImpl.java              [Task 16]
    ├── exception/
    │   ├── ResourceNotFoundException.java                          [Task 17]
    │   └── GlobalExceptionHandler.java                             [Task 18]
    └── controller/
        └── NotificationPreferenceController.java                   [Task 19]

api-gateway/src/main/resources/
└── application.properties                                          [Task 20 — modify]
```

---

## 6. Out of Scope (not in this spec)

- Sending actual email/SMS/push notifications (this spec only covers *preference storage*).
- Admin endpoints to list all users' preferences.
- Preference history / audit log.
- Soft-delete of preferences.
- Event-driven notification dispatch (Kafka/RabbitMQ).

---

## 7. Open Questions (resolve before implementation)

1. Should the GET endpoint **auto-create** defaults silently, or return **404** if no
   record exists and let the client explicitly call PUT to initialize? — *Spec currently
   proposes auto-create (better UX, fewer client-side null checks).*

2. Is port **8085** free in the local dev environment, or should a different port be
   assigned?

3. Should `SwaggerConfig.java` be unique per service (current pattern) or should Swagger
   eventually be aggregated through the gateway? — *Out of scope for this spec, using
   per-service pattern.*

---

*This spec was generated from codebase analysis of the Nixtap Microservice project.
No code has been modified. Awaiting approval to begin implementation.*
