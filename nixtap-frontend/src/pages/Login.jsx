import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(formData.email, formData.password);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const role = res?.data?.role || res?.role || storedUser?.role || (formData.email.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER');

      if (role === 'ROLE_ADMIN' || role === 'ADMIN' || formData.email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const serverMessage = err.message || err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 position-relative" style={{ background: 'linear-gradient(180deg, #FAF8FF 0%, #FFFFFF 100%)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center g-5 justify-content-center">
          <div className="col-12 col-lg-6 col-xl-5 d-none d-lg-block">
            <div className="pe-xl-4">
              <Link className="d-flex align-items-center fw-extrabold text-dark fs-3 mb-4 text-decoration-none" to="/">
                <span className="p-2 radius-sm bg-pastel-purple text-white me-2 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-layers-half fs-5"></i>
                </span>
                <span className="fw-bold tracking-tight">Nixtap.</span>
              </Link>

              <h1 className="fw-extrabold text-dark display-4 mb-3 lh-tight" style={{ letterSpacing: '-0.02em' }}>
                Welcome Back to <span className="text-purple accent-underline">Your Hub</span>
              </h1>
              <p className="text-secondary fs-5 mb-4" style={{ color: '#475569' }}>
                Sign in to manage your digital cards, track shares, view real-time analytics, and schedule meetings seamlessly.
              </p>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="floating-tag bg-pastel-lavender text-purple">
                  <i className="bi bi-hand-index-thumb"></i> #NFCReady
                </span>
                <span className="floating-tag bg-pastel-soft-yellow text-dark">
                  <i className="bi bi-qr-code"></i> #InstantScan
                </span>
                <span className="floating-tag bg-pastel-cyan text-info">
                  <i className="bi bi-graph-up-arrow"></i> #RealtimeStats
                </span>
              </div>

              <div className="p-4 bg-white rounded-4 border border-slate-200 shadow-sm">
                <div className="d-flex gap-3 align-items-center mb-2">
                  <div className="rounded-circle bg-pastel-purple text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    JD
                  </div>
                  <div>
                    <div className="fw-bold text-dark small">John Doe</div>
                    <div className="extra-small text-muted">Senior Product Manager</div>
                  </div>
                </div>
                <p className="text-secondary extra-small mb-0 fst-italic">
                  "Nixtap turned every conference handshake into a tracked, actionable connection."
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 col-xl-5">
            <div className="bg-white rounded-4 border border-slate-200 shadow-xl overflow-hidden p-4 p-sm-5">
              <div className="text-center mb-4">
                <Link className="d-lg-none d-flex align-items-center justify-content-center fw-extrabold fs-3 mb-3 text-decoration-none text-dark" to="/">
                  <span className="p-2 radius-sm bg-pastel-purple text-white me-2 d-inline-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-layers-half"></i>
                  </span>
                  <span>Nixtap.</span>
                </Link>
                <h3 className="fw-extrabold text-dark mb-1">Sign In</h3>
                <p className="mb-0 text-secondary small">Access your Nixtap Microservice dashboard</p>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-4 small rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                  <div>{error}</div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-bold text-dark">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control border-start-0"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label small fw-bold text-dark">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control border-start-0"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn bg-pastel-purple text-white fw-bold py-3 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                    style={{ background: '#7C3AED' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <i className="bi bi-arrow-right"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center pt-4 border-top mt-4">
                <p className="mb-0 text-muted small">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-purple fw-bold text-decoration-none">
                    Register now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
