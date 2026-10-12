import React, { useState } from 'react';
import './Login.css';
import loginImage from '../assets/login-bg.jpg';

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@beeproperty.com');
  const [password, setPassword] = useState('•••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSessionActive, setKeepSessionActive] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback(null);

    if (!email.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your agency email address.' });
      return;
    }
    if (!password) {
      setFeedback({ type: 'error', message: 'Please enter your security password.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      if (onLogin) {
        onLogin();
      } else {
        window.location.href = '/dashboard';
      }
    }, 800);
  };

  return (
    <div className="login-screen-wrapper">
      {/* Full-screen panoramic gated residential community background */}
      <div
        className="login-panoramic-bg"
        style={{ backgroundImage: `url(${loginImage})` }}
        aria-hidden="true"
      >
        <div className="dark-overlay" />
      </div>

      {/* Main Container: Floating White Card positioned on the right */}
      <main className="login-content-container">
        <div className="white-login-card">
          {/* Card Header */}
          <div className="card-header-section">
            <h1 className="portal-main-heading">
              <strong>AGENCY</strong> PORTAL
            </h1>
            <p className="portal-subheading">
              BEE PROPERTY MANAGEMENT
            </p>
          </div>

          {/* Form Feedback if any */}
          {feedback && (
            <div className={`card-feedback ${feedback.type}`} role="alert">
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Form */}
          <form className="agency-signin-form" onSubmit={handleSubmit}>
            {/* 1. Agency Email Address */}
            <div className="form-field-group">
              <label htmlFor="agency-email" className="field-label">
                 Email Address
              </label>
              <div className={`custom-input-box ${focusedField === 'email' ? 'is-focused' : ''}`}>
                <span className="field-icon-left" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="agency-email"
                  type="email"
                  className="native-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* 2. Security Password */}
            <div className="form-field-group">
              <label htmlFor="security-password" className="field-label">
                Security Password
              </label>
              <div className={`custom-input-box ${focusedField === 'password' ? 'is-focused' : ''}`}>
                <span className="field-icon-left" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="security-password"
                  type={showPassword ? 'text' : 'password'}
                  className="native-input password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 3. Keep Session Active Checkbox */}
            <div className="checkbox-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={keepSessionActive}
                  onChange={(e) => setKeepSessionActive(e.target.checked)}
                />
                <span className="custom-checkmark">
                  {keepSessionActive && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="checkbox-text">Keep session active</span>
              </label>
            </div>

            {/* 4. Primary Sign In Button */}
            <button
              type="submit"
              className="primary-signin-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="btn-arrow" aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
