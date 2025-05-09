import React from "react";
import "./LoadingPage.css";

const LoadingPage = ({ profile }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Welcome back, {profile?.fname || 'Student'}!</h1>
          <p className="hero-description">
            Continue your learning journey with personalized courses designed to help you grow.
            Whether you're advancing your career or exploring new interests, we've got you covered.
          </p>
          <a href="#courses_main_container" className="hero-button">
            Explore Courses
          </a>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Students learning" />
        </div>
      </div>
    </section>
  );
};

export default LoadingPage;