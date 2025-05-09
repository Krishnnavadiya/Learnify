import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../Dashboard/Sidebar/Sidebar';
import getToken from '../../../services/getToken';
import { editStudentProfile, getStudentProfile } from '../../../services/Apis';
import LoadingComponent from './../../Loading/Loading';
import { toast } from 'react-toastify';
import './EditStuProfile.css';

const EditStuProfile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const token = getToken('student');

    const [inputData, setInputData] = useState({
        username: "",
        fname: "",
        lname: "",
        gender: "",
        country: "",
        dob: "",
        educationLevel: "",
        email: "",
        phone: "",
        profilePic: ""
    });

    const [profilePic, setProfilePic] = useState(null);
    const [interests, setInterests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const [profile] = await Promise.all([
                        getStudentProfile()
                    ]);
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
        return <div className="error-message">Error: {error}</div>;
    }

    const handleChange = (e) => {
        const inputDate = new Date(e.target.value);
        const currentDate = new Date();

        if (inputDate > currentDate) {
            toast.warning("Please select a date that is not in the future.");
            e.target.value = '';
            return;
        }
        const { name, value } = e.target;
        setInputData({
            ...inputData,
            [name]: value,
        });
    }

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }
        setProfilePic(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: inputData.username || profile.username,
            fname: inputData.fname || profile.fname,
            lname: inputData.lname || profile.lname,
            gender: inputData.gender || profile.gender,
            location: inputData.country || profile.country,
            dob: inputData.dob || profile.dob,
            educationLevel: inputData.educationLevel || profile.educationLevel,
            email: inputData.email || profile.email,
            phone: inputData.phone || profile.phone,
            interests: interests.length ? interests : profile.interests,
            profilePic: profilePic || profile.profilePic
        };

        try {
            const edited = await editStudentProfile(formData);

            if (edited?.status === 200) {
                toast.success('Profile updated successfully');
                navigate('/student/profile');
                window.location.reload(true);
            } else {
                toast.error('Error updating profile');
            }
        } catch (error) {
            toast.error('An error occurred while updating profile');
        }
    }

    return (
        <div className="profile-edit-container">
            <Navbar />
            <div className="profile-edit-content">
                <div className="profile-edit-header">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar">
                            {profile?.profilePic ? (
                                <img
                                    src={`https://common-ground-9kqv.onrender.com/${profile?.profilePic?.split('/').pop()}`}
                                    alt="Profile"
                                    onClick={() => document.getElementById('file-input').click()}
                                />
                            ) : (
                                <img
                                    src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
                                    alt="Default profile"
                                    onClick={() => document.getElementById('file-input').click()}
                                />
                            )}
                            <div className="profile-avatar-overlay">
                                <span>Change Photo</span>
                            </div>
                            <input
                                type="file"
                                id="file-input"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                        <h1 className="profile-username">{profile.username}</h1>
                    </div>
                </div>

                <div className="profile-edit-form-container">
                    <form onSubmit={handleSubmit} className="profile-edit-form">
                        <h2 className="profile-edit-title">Edit Profile Information</h2>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="fname"
                                    onChange={handleChange}
                                    value={inputData.fname}
                                    placeholder={profile.fname}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lname"
                                    onChange={handleChange}
                                    value={inputData.lname}
                                    placeholder={profile.lname}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <input
                                    type="text"
                                    name="gender"
                                    onChange={handleChange}
                                    value={inputData.gender}
                                    placeholder={profile.gender}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    onChange={handleChange}
                                    value={inputData.dob}
                                    placeholder={profile.dob}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    value={inputData.email}
                                    placeholder={profile.email}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    onChange={handleChange}
                                    value={inputData.phone}
                                    placeholder={profile.phone}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <Link to="/student/profile" className="cancel-btn">
                                Cancel
                            </Link>
                            <button type="submit" className="submit-btn">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditStuProfile;