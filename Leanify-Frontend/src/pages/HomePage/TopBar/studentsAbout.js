import React from "react";
import "./studentsAbout.css";

export const homeAbout = [
  {
    id: 1,
    cover: "https://img.icons8.com/dotty/80/000000/storytelling.png",
    title: "Course Accessibility",
    desc: "Select a suitable course from the vast area of other courses",
  },
  {
    id: 2,
    cover: "https://img.icons8.com/ios/80/000000/diploma.png",
    title: "Schedule Learning",
    desc: "Learn at whatever and whenever at your suitable time and place.",
  },
  {
    id: 3,
    cover: "https://img.icons8.com/ios/80/000000/athlete.png",
    title: "Expert Instructions",
    desc: "Hold the opportunity to learn from the industry's expert",
  },
];

const AboutCard = ({ id }) => {
  return (
    <div id={id} className="why-choose-section">
      <div className="why-choose-container">
        <div className="why-choose-content">
          <div className="why-choose-header">
            <h2 className="why-choose-subtitle">Why choose</h2>
            <h2 className="why-choose-title">Learnify</h2>
            <p className="why-choose-description">
              Look into yourself, get something in return as your achievement.
            </p>
          </div>
        </div>

        <div className="features-container">
          {homeAbout.map((val, index) => (
            <div className="feature-card" key={val.id}>
              <div className="feature-icon-container">
                <img
                  src={val.cover}
                  alt={val.title}
                  className="feature-icon"
                  loading="lazy"
                />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{val.title}</h3>
                <p className="feature-description">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutCard;