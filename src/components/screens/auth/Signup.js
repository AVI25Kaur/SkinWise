import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./auth.css";

const Signup = () => {
  const history = useHistory();
  const { signup, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      history.replace("/home");
    }
  }, [isAuthenticated, history]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value, allValues = formData) => {
    switch (name) {
      case "name":
        if (!value || !value.trim()) {
          return "Full name is required.";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters long.";
        }
        return "";

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
        if (value.length < 6) {
          return "Password must be at least 6 characters long.";
        }
        return "";

      case "confirmPassword":
        if (!value) {
          return "Please confirm your password.";
        }
        if (value !== allValues.password) {
          return "Passwords do not match.";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...formData, [name]: value };
    setFormData(updatedValues);
    setServerError("");

    if (touched[name]) {
      const errorMsg = validateField(name, value, updatedValues);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }

    if (name === "password" && touched.confirmPassword) {
      const confirmError = validateField("confirmPassword", updatedValues.confirmPassword, updatedValues);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name, formData),
      email: validateField("email", formData.email, formData),
      password: validateField("password", formData.password, formData),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword, formData),
    };

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
    if (hasErrors) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await signup(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirmPassword
      );
      history.push("/home");
    } catch (err) {
      setServerError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card auth-card-wide">
        <Link to="/" className="auth-back-link">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>

        <div className="auth-header">
          <div className="auth-icon-badge">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Join SkinWise to access the full diagnostic questionnaire, dermatologist locator, and health tools.
          </p>
        </div>

        {serverError && (
          <div className="auth-alert" style={{ backgroundColor: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030" }}>
            <i className="fas fa-exclamation-triangle auth-alert-icon"></i>
            <div>
              <strong>Signup failed</strong>
              <p style={{ margin: "0.2rem 0 0 0" }}>{serverError}</p>
            </div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name Field */}
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="signup-name">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="signup-name"
                type="text"
                name="name"
                className={`auth-input ${errors.name ? "has-error" : ""}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
                disabled={isSubmitting}
              />
              <i className="fas fa-user auth-input-icon"></i>
            </div>
            {errors.name && (
              <span className="auth-error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.name}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="signup-email">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="signup-email"
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
            <label className="auth-label" htmlFor="signup-password">
              Password <span className="required-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className={`auth-input ${errors.password ? "has-error" : ""}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
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

          {/* Confirm Password Field */}
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="signup-confirm-password">
              Confirm Password <span className="required-star">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`auth-input ${errors.confirmPassword ? "has-error" : ""}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              <i className="fas fa-check-double auth-input-icon"></i>
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="auth-error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating account...
              </>
            ) : (
              <>
                <i className="fas fa-user-check"></i> Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-switch-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
