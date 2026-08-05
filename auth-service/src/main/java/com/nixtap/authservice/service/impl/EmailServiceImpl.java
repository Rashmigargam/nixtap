package com.nixtap.authservice.service.impl;

import com.nixtap.authservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify your Nixtap account");
            message.setText(
                    "Hello,\n\n" +
                            "Please verify your email address by clicking the link below:\n\n" +
                            baseUrl + "/api/v1/auth/verify-email?token=" + verificationCode + "\n\n" +
                            "This link will remain active until you verify your account.\n\n" +
                            "If you did not create a Nixtap account, please ignore this email.\n\n" +
                            "— The Nixtap Team");
            mailSender.send(message);
            log.info("Verification email sent to {}", toEmail);
        } catch (MailException e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
            // Do not rethrow — email failure should not block registration
        }
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Reset your Nixtap password");
            message.setText(
                    "Hello,\n\n" +
                            "We received a request to reset your Nixtap account password.\n\n" +
                            "Use the token below to reset your password (valid for 2 hours):\n\n" +
                            resetToken + "\n\n" +
                            "Or click the link:\n" +
                            baseUrl + "/api/v1/auth/reset-password?token=" + resetToken + "\n\n" +
                            "If you did not request a password reset, please ignore this email.\n\n" +
                            "— The Nixtap Team");
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (MailException e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send password reset email. Please try again later.");
        }
    }
}
