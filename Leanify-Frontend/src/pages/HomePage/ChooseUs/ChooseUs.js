import React from "react";
import "./ChooseUs.css";
import chooseBackgroundImg from "../Images/why-choose-us.png";

const ChooseUs = ({ id }) => {
  return (
    <div id={id} className="choose-us-section">
      <div className="choose-us-container">
        <div className="choose-content-wrapper">
          <div className="choose-content">
            <h2 className="section-title">Why Choose Our Platform</h2>
            <div className="divider"></div>
            <p className="section-description">
              Our team comprises dedicated educators, industry experts, and tech enthusiasts
              who believe in the power of education to transform lives. We aim to break down
              barriers to education, making it accessible to anyone, anywhere. Join us on this
              educational journey, where curiosity meets expertise, and together, let's unlock
              the door to endless possibilities.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon-tick">✓</div>
                <span>Expert educators with industry experience</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon-tick">✓</div>
                <span>Accessible learning for everyone</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon-tick">✓</div>
                <span>Cutting-edge curriculum</span>
              </div>
            </div>
          </div>
          <div className="choose-image">
            <img
              src={chooseBackgroundImg}
              alt="Our team of educators"
              className="featured-image"
              loading="lazy"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseUs;