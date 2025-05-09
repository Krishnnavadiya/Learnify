import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HashLink as Link } from 'react-router-hash-link';
import { homepage } from "../../../data/Edusidebar";
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import logo from "../../../data/imgs/Logo.png";

const HomeNavbar = (props) => {
    const location = useLocation();
    const [selected, setSelected] = useState(0);

    return (
        <nav id="menu" className="navbar navbar-default navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1"
                    >
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <NavLink className="navbar-brand page-scroll" to="#page-top">
                        { <img src={logo} alt="" height={40} /> }
                    </NavLink>
                </div>

                <div
                    className="collapse navbar-collapse"
                    id="bs-example-navbar-collapse-1"
                >
                    <ul className="nav navbar-nav navbar-right">
                        {homepage.map((item, index) => (
                            <li key={index}>
                                <Link
                                    smooth
                                    to={item.route}
                                    className="page-scroll"
                                    style={
                                        location.pathname === item.route ? { color: "0C356a" } : {}
                                    }
                                >
                                    {item.heading}
                                </Link>
                            </li>
                        ))}

                        <li className="dropdown">
                            <a
                                href="#"
                                className="dropdown-toggle"
                                data-toggle="dropdown"
                                role="button"
                                aria-haspopup="true"
                                aria-expanded="false"
                                style={{
                                    fontSize: '1.4rem',
                                    color: '#333',
                                }}
                            >
                                Log in <span className="caret"></span>
                            </a>
                            <ul
                                className="dropdown-menu"
                                style={{
                                    minWidth: '160px',
                                    fontSize: '1.5rem',
                                    padding: '5px 0',
                                    marginTop: '10px'
                                }}
                            >
                                <li style={{ padding: '3px 15px' }}>
                                    <NavLink to="/student/login" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <PiStudent size={20} /> Student Login
                                    </NavLink>
                                </li>
                                <li style={{ padding: '3px 15px' }}>
                                    <NavLink to="/educator/login" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FaChalkboardTeacher size={20} />Educator Login
                                    </NavLink>
                                </li>
                            </ul>

                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default HomeNavbar;