import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicNavbar = () => {
  const { isAuthenticated, user } = useAuth();

  const isAdmin =
    user?.role === 'ROLE_ADMIN' ||
    (Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN'));

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(241, 245, 249, 0.8)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-extrabold fs-4 me-4 text-dark" to="/">
          <span className="p-2 radius-sm bg-pastel-purple text-white me-2 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
            <i className="bi bi-layers-half fs-5"></i>
          </span>
          <span className="fw-bold tracking-tight" style={{ color: '#0f172a' }}>Nixtap</span>
          <span className="ms-1 badge bg-pastel-lavender text-primary rounded-pill small fw-bold" style={{ fontSize: '0.65rem' }}>PRO</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNavbar"
          aria-controls="publicNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="publicNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 bg-light px-3 py-1.5 rounded-pill border border-slate-200">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link px-3 py-1.5 rounded-pill fw-semibold small ${
                    isActive ? 'bg-white text-primary shadow-sm' : 'text-secondary'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <a
                href="#features"
                className="nav-link px-3 py-1.5 rounded-pill fw-semibold small text-secondary"
              >
                Features
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#how"
                className="nav-link px-3 py-1.5 rounded-pill fw-semibold small text-secondary"
              >
                How It Works
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#testimonials"
                className="nav-link px-3 py-1.5 rounded-pill fw-semibold small text-secondary"
              >
                Reviews
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-pill bg-dark text-white fw-bold px-4 py-2 small d-flex align-items-center gap-2 shadow-sm"
                >
                  <span>Dashboard</span>
                  <span className="bg-white text-dark rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', fontSize: '0.75rem' }}>
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="btn btn-pill bg-pastel-purple text-white fw-bold px-3 py-2 small"
                  >
                    <i className="bi bi-shield-lock-fill me-1"></i> Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-pill bg-white text-dark fw-bold px-3.5 py-2 small border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-pill bg-pastel-purple text-white fw-bold px-4 py-2 small d-flex align-items-center gap-2 shadow-md"
                >
                  <span>Get started</span>
                  <span className="bg-white text-purple rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', fontSize: '0.75rem', color: '#7c3aed' }}>
                    <i className="bi bi-arrow-up-right"></i>
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
