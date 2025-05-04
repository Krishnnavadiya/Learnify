import React from 'react';
import Star from "./../Educator/EduOfferedCourses/stars";
import { NavLink } from 'react-router-dom';
import "./Coursecard.css";

const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.split(' ').length > limit) {
        return text.split(' ').slice(0, limit).join(' ') + '...';
    }
    return text;
};

const Coursecard = ({ course }) => {
    if (!course) {
        return <h2 className="no-course-text">You have not created any courses.</h2>;
    }

    const truncatedDescription = truncateText(course.courseDescription, 25);

    return (
        <div className="modern-card-container">
            <div className="modern-course-card">
                <div className="modern-course-detail">
                    <h2>{course.courseTitle}</h2>
                    <p>{truncatedDescription}</p>
                </div>
                <div className="modern-course-meta">
                    <span>By {`${course.createdBy?.fname} ${course.createdBy?.lname}`}</span>
                    <Star stars={course.rating >= 5 ? 5 : course.rating} />
                </div>
                <div className="modern-course-footer">
                    <h4>{course.enrolledStudents ? course.enrolledStudents.length : 0} Students</h4>
                    <div className="price-button">
                        <span>{course.coursePrice === 0 ? "Free" : `Rs. ${course.coursePrice}`}</span>
                        <button>
                            <NavLink to={`/course/${course._id}`} style={{ color: "white" }}>View Course</NavLink>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coursecard;
