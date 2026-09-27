import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./auth.css";

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const fromPath = location.state && location.state.from ? location.state.from.pathname : "/home";
      history.replace(fromPath);
    }
  }, [isAuthenticated, history, location]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value || !value.trim()) {
          return "Email address is required.";
        }
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address (e.g., user@example.com).";
        }
        return "";

      case "password":
        if (!value) {
          return "Password is required.";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError("");

    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setTouched({
      email: true,
      password: true,
    });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
    if (hasErrors) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await login(formData.email.trim(), formData.password);
      const fromPath = location.state && location.state.from ? location.state.from.pathname : "/home";
      history.push(fromPath);
    } catch (err) {
      setServerError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" className="auth-back-link">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>

        <div className="auth-header">
          <div className="auth-icon-badge">
            <i className="fas fa-user-lock"></i>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Log in to access your SkinWise health profile and saved assessments.
          </p>
        </div>

        {serverError && (
          <div className="auth-alert" style={{ backgroundColor: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030" }}>
            <i className="fas fa-exclamation-triangle auth-alert-icon"></i>
            <div>
              <strong>Login failed</strong>
              <p style={{ margin: "0.2rem 0 0 0" }}>{serverError}</p>
            </div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="login-email">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="login-email"
                type="email"
                name="email"
                className={`auth-input ${errors.email ? "has-error" : ""}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                disabled={isSubmitting}
              />
              <i className="fas fa-envelope auth-input-icon"></i>
            </div>
            {errors.email && (
              <span className="auth-error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="login-password">
              Password <span className="required-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className={`auth-input ${errors.password ? "has-error" : ""}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <i className="fas fa-lock auth-input-icon"></i>
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            {errors.password && (
              <span className="auth-error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Logging in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Log In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?
          <Link to="/signup" className="auth-switch-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
