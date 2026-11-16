

import React from "react";
import landingImg from "../../images/landing.svg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div id="home">
      <div className="wrapper">
        <div className="left">
          <h1>SkinWise</h1>

          <h2>Your Skin Health, Your Awareness</h2>

          <p>
            Take a step towards better skin health.
            Explore AI skin checks and dermatologist guidance
            to stay informed about your skin.
          </p>

          <div className="btns">
            <Link to="/ai-skin-check">
              <div className="btn1">
                <h3>AI Skin Check</h3>
              </div>
            </Link>

            <Link to="/find-a-dermatologist">
              <div className="btn2">
                <h3>Find a Dermatologist</h3>
              </div>
            </Link>
          </div>
        </div>

        <div className="right">
          <img src={landingImg} alt="Skin health awareness" />
        </div>
      </div>
    </div>
  );
};

export default Home;
