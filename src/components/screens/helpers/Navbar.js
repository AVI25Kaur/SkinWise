import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  let nav = useRef(null);
  let navToggle = useRef(null);
  let navId = useRef(null);
  const history = useHistory();
  const { isAuthenticated, user, logout } = useAuth();

  const toggle = () => {
    if (navToggle && navToggle.classList) navToggle.classList.toggle("expanded");
    if (nav && nav.classList) nav.classList.toggle("expanded");
    if (navId && navId.classList) navId.classList.toggle("expanded");
  };

  const handleLogout = () => {
    logout();
    if (navToggle && navToggle.classList && navToggle.classList.contains("expanded")) {
      toggle();
    }
    history.push("/");
  };

  return (
    <div id="navbar">
      <div className="logo">
        <Link to={isAuthenticated ? "/home" : "/"}>
          <h2>SkinWise</h2>
        </Link>
      </div>

      <div className="nav-toggle" ref={(ele) => (nav = ele)}>
        <div
          className="nav-toggle-bar"
          ref={(ele) => (navToggle = ele)}
          onClick={toggle}
        ></div>
      </div>

      <div id="nav" className="links" ref={(ele) => (navId = ele)}>
        {isAuthenticated ? (
          <>

            <div className="link" onClick={toggle}>
              <Link to="/info">Skin Cancer Information</Link>
            </div>

            <div className="link" onClick={toggle}>
              <Link to="/get-tested">Skin Health Questionnaire</Link>
            </div>

            <div className="link" onClick={toggle}>
              <Link to="/find-a-dermatologist">Find a Dermatologist</Link>
            </div>

            <div className="link" onClick={toggle}>
              <Link to="/blog">Blog</Link>
            </div>

            <div
              className="link"
              style={{
                color: "#ff2e63",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <i className="fas fa-user-circle"></i>
              <span>{user ? user.name.split(" ")[0] : "User"}</span>
            </div>

            <div className="link">
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1.5px solid #ff2e63",
                  color: "#ff2e63",
                  padding: "0.35rem 0.9rem",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff2e63";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#ff2e63";
                }}
              >
                <i className="fas fa-sign-out-alt" style={{ marginRight: "0.35rem" }}></i>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="link" onClick={toggle}>
              <Link to="/">Home</Link>
            </div>

            <div className="link" onClick={toggle}>
              <Link to="/about">About</Link>
            </div>

            <div className="link" onClick={toggle}>
              <Link to="/login">Login</Link>
            </div>

            <div className="link" onClick={toggle}>
              <Link
                to="/signup"
                style={{
                  backgroundColor: "#ff2e63",
                  color: "#ffffff",
                  padding: "0.45rem 1.1rem",
                  borderRadius: "20px",
                  fontWeight: 600,
                }}
              >
                Get Started
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;