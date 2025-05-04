import React from 'react';
import './Coursescard.css';
import { NavLink } from 'react-router-dom';
import Coursecard from '../../../CourseCard/Coursecard';

function Coursescard({ coursesData }) {
    return (
        <section className="courses-section" id="courses_main_container">
            <div className="section-header">
                <h2 className="section-title">Featured Courses</h2>
                <NavLink to="/student/view-courses" className="view-all-btn">
                    View All Courses <span className="arrow">→</span>
                </NavLink>
            </div>

            <hr style={{ width: '90vw' }} />
            <div className="courses-grid">
                {coursesData.map((course, index) => (
                    <>
                        <Coursecard key={index} course={course} />
                    </>
                ))}
            </div>
        </section>
    );
}

export default Coursescard;