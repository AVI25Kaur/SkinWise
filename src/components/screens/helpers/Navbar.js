
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  let nav = useRef(null);
  let navToggle = useRef(null);
  let navId = useRef(null);

  const toggle = () => {
    navToggle.classList.toggle("expanded");
    nav.classList.toggle("expanded");
    navId.classList.toggle("expanded");
  };

  return (
    <div id="navbar">
      <div className="logo">
        <Link to="/">
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
        <div className="link" onClick={toggle}>
          <Link to="/info">Skin Cancer Information</Link>
        </div>

        <div className="link" onClick={toggle}>
          <Link to="/get-tested">Skin Health Questionnaire</Link>
        </div>

        <div className="link" onClick={toggle}>
          <Link to="/find-a-dermatologist">
            Find a Dermatologist
          </Link>
        </div>

        <div className="link" onClick={toggle}>
          <a
            href="https://kira-blog.herokuapp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;