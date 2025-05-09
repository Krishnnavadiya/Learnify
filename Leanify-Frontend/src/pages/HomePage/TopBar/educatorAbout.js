import React from "react";
import "./about.css";
import eduactorImg from "../Images/educator.jpg";

export const homeAbout = [
  {
    id: 1,
    cover: "https://img.icons8.com/dotty/80/000000/storytelling.png",
    title: "Online Courses",
    desc: "In the vast expanse of digital learning, your knowledge and experience can shine like a beacon, reaching learners from all corners of the globe. Share your expertise through meticulously crafted online courses.",
  },
  {
    id: 2,
    cover: "https://img.icons8.com/ios/80/000000/diploma.png",
    title: "Mentoring and Guidance",
    desc: "As an educator, your role goes beyond certification. You have the power to mentor and guide students on their educational journey, helping them build knowledge, skills, and a deeper understanding of the subject matter.",
  },
  {
    id: 3,
    cover: "https://img.icons8.com/ios/80/000000/athlete.png",
    title: "Expert Facilitation",
    desc: "Your wisdom is a guiding light, illuminating the path of those hungry for knowledge. Foster an environment where students can thrive under your expert guidance.",
  },
];

const AboutCard = ({ id }) => {
  return (
    <div id={id} className="about-card-section">
      <div className="container">
        <div className="about-card-wrapper">
          <div className="about-content">
            {/* <div className="section-header">
              <h2 className="section-subtitle">Enable Lifelong Learning</h2>
              <h3 className="section-title">Advantages of Sharing Your Expertise Online</h3>
              <div className="divider"></div>
            </div> */}

            <div className="features-grid">
              {homeAbout.map((val) => (
                <div className="feature-card" key={val.id}>
                  <div className="feature-icon">
                    <img src={val.cover} alt={val.title} />
                  </div>
                  <div className="feature-content">
                    <h4>{val.title}</h4>
                    <p>{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-image">
            <img src={eduactorImg} alt="Educator sharing knowledge" className="educator-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCard;