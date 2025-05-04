import React from "react";
import "./Footer.css";
import { NavLink } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart } from "react-icons/fa";

const Footer = ({ id }) => {
  return (
    <div id={id} className="footer-container">
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="logo-text">Learnify</h2>
            <p className="tagline">ONLINE EDUCATION & LEARNING</p>
            <p className="mission-statement">
              Empowering learners and educators through innovative digital education solutions.
            </p>
          </div>

          <div className="footer-links">
            <h3 className="links-title">Quick Links</h3>
            <ul className="links-list">
              <li>
                <NavLink to="/student/login" className="footer-link">
                  Student Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/educator/login" className="footer-link">
                  Educator Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/register" className="footer-link">
                  Student Register
                </NavLink>
              </li>
              <li>
                <NavLink to="/educator/register" className="footer-link">
                  Educator Register
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3 className="contact-title">Have Questions?</h3>
            <ul className="contact-info">
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>
                  DA-IICT College, Reliance Cross Rd, Gandhinagar, Gujarat 382007
                </span>
              </li>
              <li className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 1234567890</span>
              </li>
              <li className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:Learify@gmail.com" className="email-link">
                  Learify@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            Copyright ©{new Date().getFullYear()} All rights reserved | Learify{" "}
            <FaHeart className="heart-icon" />
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;