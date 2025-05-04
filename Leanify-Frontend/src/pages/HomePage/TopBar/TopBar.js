import React from "react";
import "./TopBar.css";
import { NavLink } from "react-router-dom";

const TopBar = ({ id }) => {
  return (
    <div id={id} className="top-bar-container">
      <div className="top-bar-overlay"></div>
      <div className="top-bar-content">
        <div className="top-bar-text">
          <h2 className="welcome-text">WELCOME TO LEARNIFY</h2>
          <h3 className="top-tagline">Don't limit yourself to learning</h3>
          <p className="description">
            With the help of E-learning, create your own path and drive your skills
            forward to achieve what you seek
          </p>
          <div className="cta-buttons">
            <NavLink to="/student/login" className="cta-button primary">
              GET STARTED NOW
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;