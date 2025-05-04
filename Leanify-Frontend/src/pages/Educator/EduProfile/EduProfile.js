import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import EdNavbar from '../Dashboard/Sidebar/Navbar';
import getToken from '../../../services/getToken';
import { getEducatorProfile } from '../../../services/Apis';
import LoadingComponent from '../../Loading/Loading';
import './EduProfile.css';

const EduProfile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    const token = getToken('educator');

    const calculateAge = useCallback((dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const currentDate = new Date();
        let ageDiff = currentDate.getFullYear() - birthDate.getFullYear();
        if (
            currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() &&
                currentDate.getDate() < birthDate.getDate())
        ) {
            ageDiff--;
        }
        return ageDiff;
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const profile = await getEducatorProfile();
                    setProfile(profile);
                    setLoading(false);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch profile. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (!token) {
        return <Navigate to="/educator/login" />;
    }

    if (loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    console.log(profile);

    const profilePicUrl = profile?.profilePic
        ? `${process.env.REACT_APP_API_URL}/${profile.profilePic.split('/').pop()}`
        : 'path/to/default-image.jpg';

    return (
        <div className="profile-container">
            <EdNavbar />
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            {profile?.profilePic ? (
                                <img
                                    src={`https://common-ground-9kqv.onrender.com/${profile?.profilePic?.split('/').pop()}`}
                                    alt="Profile"
                                />
                            ) : (
                                <img
                                    src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
                                    alt="Default profile"
                                />
                            )}
                        </div>
                        <h1 className="profile-username">{profile?.username}</h1>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="profile-card">
                        <h2 className="profile-section-title">Personal Information</h2>
                        <div className="profile-info-grid">
                            <div className="profile-info-item">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{profile?.fname || 'N/A'} {profile?.lname || ''}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Gender</span>
                                <span className="info-value">{profile?.gender || 'N/A'}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Age</span>
                                <span className="info-value">{calculateAge(profile?.dob)} years</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{profile?.email || 'N/A'}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{profile?.phone || 'N/A'}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Bio</span>
                                <span className="info-value">{profile?.bio || 'N/A'}</span>
                            </div>
                            <div className="profile-info-item">
                                <span className="info-label">Country</span>
                                <span className="info-value">{profile?.location || 'N/A'}</span>
                            </div>
                            {profile?.education && (
                                <div className="profile-info-item">
                                    <span className="info-label">Education</span>
                                    <span className="info-value">{profile.education}</span>
                                </div>
                            )}
                            <div className="profile-info-item">
                                <span className="info-label">UPI ID</span>
                                <span className="info-value">{profile?.upiID || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/educator/update" className="edit-profile-button">
                        Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EduProfile;