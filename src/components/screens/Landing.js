import React from "react";
import { Link } from "react-router-dom";
import landingImg from "../../images/landing.svg";
import { useAuth } from "../../context/AuthContext";
import "./landing.css";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <i className="fas fa-shield-alt"></i> Skin Health & Cancer Awareness
          </div>

          <h1 className="landing-hero-title">
            Your Proactive Partner in <span>Skin Cancer Awareness</span> & Detection
          </h1>

          <p className="landing-hero-desc">
            SkinWise empowers you to take charge of your dermatological health with
            guided clinical questionnaires,
            nationwide specialist directories, and authentic patient community stories.
          </p>

          <div className="landing-hero-actions">
            {isAuthenticated ? (
              <Link to="/home" className="landing-btn-primary">
                Go to Dashboard <i className="fas fa-arrow-right"></i>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="landing-btn-primary">
                  Know More & Get Started <i className="fas fa-arrow-right"></i>
                </Link>
                <Link to="/login" className="landing-btn-secondary">
                  <i className="fas fa-sign-in-alt"></i> Log In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="landing-hero-image-wrap">
          <img src={landingImg} alt="SkinWise Healthcare Illustration" />
        </div>
      </section>

      {/* What SkinWise Does Section */}
      <section className="landing-features-section">
        <div className="landing-section-header">
          <span className="landing-section-subtitle">What SkinWise Does</span>
          <h2 className="landing-section-title">
            Everything You Need For Proactive Skin Care
          </h2>
          <p className="landing-section-desc">
            Early detection transforms skin cancer treatment outcomes. SkinWise brings
            evidence-based assessment and clinical tools straight to your screen.
          </p>
        </div>

        <div className="landing-features-grid">
          {/* Feature 1 */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-notes-medical"></i>
            </div>
            <h3 className="landing-feature-title">Skin Health Questionnaire</h3>
            <p className="landing-feature-desc">
              Answer standardized clinical questions about evolving moles, bleeding lesions,
              and sun sensitivity to understand when a symptom warrants urgent specialist review.
            </p>
          </div>

          {/* Feature 2 */}
          {/*<div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-brain"></i>
            </div>
            <h3 className="landing-feature-title">TensorFlow AI Lesion Screening</h3>
            <p className="landing-feature-desc">
              Utilize client-side Convolutional Neural Networks trained on dermoscopic imaging
              to receive instant, preliminary risk categorizations for high-risk spots.
            </p>
          </div>*/}

          {/* Feature 3 */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <h3 className="landing-feature-title">Find Nearby Dermatologists</h3>
            <p className="landing-feature-desc">
              Interactive Mapbox integration allowing you to quickly locate verified, board-certified
              dermatologists and oncology clinics across India with direct phone and map links.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <h3 className="landing-feature-title">SkinWise-Blogs & Community</h3>
            <p className="landing-feature-desc">
              Explore authentic patient survivor experiences, oncological research briefings,
              sunscreen science, and preventative lifestyle tips from medical contributors.
            </p>
          </div>
        </div>
      </section>

      {/* Clinical Statistic Banner */}
      <section className="landing-stat-banner">
        <div className="landing-stat-content">
          <h3>Early Detection Saves Lives</h3>
          <p>
            When melanoma is detected and treated in its localized stages before spreading,
            the 5-year survival rate exceeds 99%. Regular skin self-checks and awareness are key.
          </p>
        </div>
        <Link to="/signup" className="landing-stat-btn">
          Create Free Account
        </Link>
      </section>

      {/* Bottom CTA Section */}
      <section className="landing-bottom-cta">
        <h2>Ready to prioritize your skin health?</h2>
        <p>
          Join SkinWise today to unlock full access to the lesion analyzer, dermatologist
          locator, and patient support network.
        </p>
        <Link to="/signup" className="landing-btn-primary">
          Get Started Now <i className="fas fa-arrow-right"></i>
        </Link>
      </section>
    </div>
  );
};

export default Landing;
