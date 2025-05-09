import React from "react";
import "./AboutUs.css";
import aboutBackgroundImg from "../Images/about-us.png";

const AboutUs = ({ id }) => {
  return (
    <div id={id} className="about-us-section">
      <div className="about-container">
        <div className="about__background">
          <img src={aboutBackgroundImg} alt="Our team working together" />
        </div>
        <div className="about__content">
          <div className="content-wrapper">
            <h2 className="section-title">About Us</h2>
            <p className="section-description">
              We believe in pushing the boundaries of what's possible. We are a team of experts
              committed to delivering outstanding results. We believe in the power of collaboration
              and hard work. Together, we strive to make a positive impact in the world.
            </p>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Team Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;