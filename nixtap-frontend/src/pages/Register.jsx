import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { fullName, email, password } = formData;
    if (!fullName || fullName.trim().length < 2 || fullName.trim().length > 100) {
      setError('Full name must be between 2 and 100 characters.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return false;
    }
    if (!password || password.length < 8 || password.length > 32) {
      setError('Password must be between 8 and 32 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData.fullName.trim(), formData.email.trim(), formData.password);
      setSuccess('Account registered successfully! Redirecting to your control panel...');
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const role = res?.data?.role || res?.role || storedUser?.role || (formData.email.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER');

      setTimeout(() => {
        if (role === 'ROLE_ADMIN' || role === 'ADMIN' || formData.email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1200);
    } catch (err) {
      const serverMessage = err.message || err.response?.data?.message || 'Registration failed. Please try again.';
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
                Create Your <span className="text-purple accent-underline">Identity</span>
              </h1>
              <p className="text-secondary fs-5 mb-4" style={{ color: '#475569' }}>
                Build your digital business card in 30 seconds. Share via NFC tap, QR code, or public URL and watch real-time analytics.
              </p>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="floating-tag bg-pastel-lavender text-purple">
                  <i className="bi bi-person-badge"></i> #DigitalIdentity
                </span>
                <span className="floating-tag bg-pastel-soft-yellow text-dark">
                  <i className="bi bi-lightning-charge"></i> #ZeroFriction
                </span>
                <span className="floating-tag bg-pastel-mint text-success">
                  <i className="bi bi-shield-check"></i> #Encrypted
                </span>
              </div>

              <div className="p-4 bg-white rounded-4 border border-slate-200 shadow-sm">
                <div className="d-flex gap-3 align-items-center mb-2">
                  <span className="p-2 rounded-circle bg-pastel-lavender text-purple d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                    <i className="bi bi-sparkles"></i>
                  </span>
                  <div>
                    <div className="fw-bold text-dark small">100% Free Account</div>
                    <div className="extra-small text-muted">Unlimited card updates · Real-time scans</div>
                  </div>
                </div>
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
                <h3 className="fw-extrabold text-dark mb-1">Create Account</h3>
                <p className="mb-0 text-secondary small">Join Nixtap microservice platform</p>
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

              {success && (
                <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4 small rounded-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2 fs-6"></i>
                  <div>{success}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label small fw-bold text-dark">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-control border-start-0"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      minLength={2}
                      maxLength={100}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-bold text-dark">
                    Email Address <span className="text-danger">*</span>
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
                    Password <span className="text-danger">*</span>
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
                      placeholder="Create password (min 8 chars)"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      maxLength={32}
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
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Started Free</span>
                        <i className="bi bi-arrow-right"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center pt-4 border-top mt-4">
                <p className="mb-0 text-muted small">
                  Already have an account?{' '}
                  <Link to="/login" className="text-purple fw-bold text-decoration-none">
                    Sign In
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

export default Register;
