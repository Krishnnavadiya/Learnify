import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import LoadingPage from './LoadingPage/LoadingPage';
import Coursescard from './Coursescard/Coursescard';
import getToken from '../../../services/getToken';
import LoadingComponent from '../../Loading/Loading';
import { Navigate } from 'react-router-dom';
import { getStudentDashboard, getStudentProfile } from '../../../services/Apis';
import './StuDashboard.css';

function StuDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [profile, setProfile] = useState(null);

    const token = getToken('student');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const [dashboardData, profile] = await Promise.all([
                        getStudentDashboard(),
                        getStudentProfile()
                    ]);
                    setDashboardData(dashboardData);
                    setProfile(profile);
                    setLoading(false);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (!token) {
        return <Navigate to="/student/login" />;
    }

    if (loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <LoadingPage profile={profile} />
                <Coursescard coursesData={dashboardData} />
            </div>
        </div>
    );
}

export default StuDashboard;