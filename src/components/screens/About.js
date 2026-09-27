import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import skinCancer from "../../assets/images/skinCancer.png";
import "./about.css";

const About = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="about-page">
      {/* ===================================================
          1. HERO SECTION
          =================================================== */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">
            <i className="fas fa-heartbeat"></i> ABOUT SKINWISE
          </span>

          <h1>
            Smarter Skin Health,
            <br />
            <span className="highlight-text">Better Awareness.</span>
          </h1>

          <p>
            SkinWise is a technology-driven platform dedicated to advancing skin
            health awareness and education. By bridging structured dermatological
            knowledge with modern digital tools, we empower individuals to
            recognize changes in their skin and understand when to consult a
            qualified healthcare professional.
          </p>

          <div className="about-hero-actions">
            {isAuthenticated ? (
              <Link to="/home" className="about-btn-primary">
                Go to Dashboard <i className="fas fa-arrow-right"></i>
              </Link>
            ) : (
              <Link to="/signup" className="about-btn-primary">
                Get Started <i className="fas fa-arrow-right"></i>
              </Link>
            )}

            <Link to="/info" className="about-btn-secondary">
              <i className="fas fa-book-open"></i> Explore Skin Health
            </Link>
          </div>
        </div>

        {/* Supporting Image Card */}
        <div className="about-hero-graphic-wrap">
          <div className="about-hero-card">
            <img
              src={skinCancer}
              alt="Skin cancer awareness"
              className="about-hero-image"
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          2. OUR MISSION
          =================================================== */}
      <section className="about-section">
        <div className="section-label">OUR MISSION</div>

        <div className="mission-grid">
          <div className="mission-heading-col">
            <h2>
              Helping people understand
              <br />
              their skin health.
            </h2>

            <div className="mission-callout">
              <i className="fas fa-bullseye"></i>
              <p>
                Bridging the gap between dermatological research and everyday
                health awareness.
              </p>
            </div>
          </div>

          <div className="mission-text-col">
            <p>
              Skin conditions can often be difficult to recognize, confusing to
              interpret, or intimidating to navigate. SkinWise aims to bridge
              this information gap by providing structured educational resources
              and technology-supported insights in a clear and accessible format.
            </p>

            <p>
              We believe technology has immense potential to support proactive
              education and prompt early clinical checkups. However, SkinWise is
              explicitly designed not to replace doctors, pathologists, or
              professional clinical diagnosis. Instead, our mission is to
              encourage routine self-examination and help users understand when
              professional medical consultation is essential.
            </p>

            <div className="mission-pillars">
              <div className="mission-pillar-card">
                <i className="fas fa-search"></i>
                <span>Promote Early Self-Checks</span>
              </div>
              <div className="mission-pillar-card">
                <i className="fas fa-user-md"></i>
                <span>Encourage Physician Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. WHAT WE OFFER
          =================================================== */}
      <section className="about-section about-features">
        <div className="section-label">WHAT WE OFFER</div>

        <div className="features-header">
          <h2>Built around better skin health awareness.</h2>
          <p>
            A cohesive suite of educational resources and digital screening
            tools focused on prevention, knowledge, and timely action.
          </p>
        </div>

        <div className="feature-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon-wrap">
                <i className="fas fa-notes-medical"></i>
              </div>
              <span className="feature-number">01</span>
            </div>
            <h3>Skin Health Information</h3>
            <p>
              Explore clear, medically referenced information about different
              skin conditions, warning signs, symptoms, preventative daily
              habits, and evidence-based care guidance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon-wrap">
                <i className="fas fa-brain"></i>
              </div>
              <span className="feature-number">02</span>
            </div>
            <h3>Technology-Assisted Insights</h3>
            <p>
              SkinWise leverages modern web technology—including clinical
              questionnaires and machine learning models—to help users better
              understand skin patterns and recognize potential risk factors.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon-wrap">
                <i className="fas fa-users"></i>
              </div>
              <span className="feature-number">03</span>
            </div>
            <h3>Awareness & Education</h3>
            <p>
              We empower communities to pay attention to subtle changes in
              their skin, adopt sun-protection routines, and readily find
              certified local dermatologists when an expert opinion is required.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. WHY SKINWISE
          =================================================== */}
      <section className="about-highlight">
        <div className="why-header">
          <span className="about-tag light">WHY SKINWISE?</span>
          <h2>
            Technology should make
            <br />
            healthcare information simpler.
          </h2>
          <p className="why-lead-desc">
            Navigating healthcare shouldn't be confusing or overwhelming.
            SkinWise combines education, awareness, and technology in one unified
            platform—empowering individuals to understand their body and make
            proactive, confident decisions for their well-being.
          </p>
        </div>

        <div className="why-pills-grid">
          <div className="why-pill-card">
            <div className="why-pill-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h4>Education First</h4>
            <p>
              Complex dermatological terminology translated into plain,
              trustworthy guides that anyone can understand.
            </p>
          </div>

          <div className="why-pill-card">
            <div className="why-pill-icon">
              <i className="fas fa-eye"></i>
            </div>
            <h4>Proactive Awareness</h4>
            <p>
              Empowering users to monitor evolving moles and atypical lesions
              before conditions advance.
            </p>
          </div>

          <div className="why-pill-card">
            <div className="why-pill-icon">
              <i className="fas fa-laptop-medical"></i>
            </div>
            <h4>Accessible Technology</h4>
            <p>
              Convenient digital access from any browser, bridging users to
              verified specialists and tools without barrier.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. IMPORTANT NOTE / DISCLAIMER
          =================================================== */}
      <section className="about-disclaimer">
        <div className="disclaimer-icon-wrap">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="disclaimer-content">
          <h3>Important Medical Disclaimer</h3>
          <p>
            SkinWise is an educational and technology-based platform. Its
            information and technology-assisted results are not a substitute for
            professional medical diagnosis, examination, or treatment. Users
            with health concerns should consult a qualified healthcare
            professional.
          </p>
        </div>
      </section>

      {/* ===================================================
          6. BOTTOM NAVIGATION CALL TO ACTION
          =================================================== */}
      <section className="about-cta-card">
        <h2>Ready to prioritize your skin health?</h2>
        <p>
          Learn more about common skin conditions, take our interactive skin
          health questionnaire, or locate a qualified dermatologist near you.
        </p>
        <div className="about-cta-actions">
          {isAuthenticated ? (
            <Link to="/home" className="about-btn-primary">
              View Your Dashboard <i className="fas fa-arrow-right"></i>
            </Link>
          ) : (
            <Link to="/signup" className="about-btn-primary">
              Create Free Account <i className="fas fa-arrow-right"></i>
            </Link>
          )}
          <Link to="/find-a-dermatologist" className="about-btn-secondary">
            <i className="fas fa-map-marker-alt"></i> Find a Dermatologist
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
