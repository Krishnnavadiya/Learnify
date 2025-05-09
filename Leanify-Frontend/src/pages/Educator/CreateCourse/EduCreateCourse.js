import React, { useState } from 'react';
import './CreateCourseForm.css';
import { ToastContainer, toast } from 'react-toastify';
import { educreatecoursefunction } from '../../../services/Apis';
import getToken from '../../../services/getToken';
import { Navigate, useNavigate } from 'react-router-dom';
import EdNavbar from '../Dashboard/Sidebar/Navbar';

function EduCreateCourse() {
    const [inputdata, setInputdata] = useState({
        courseTitle: '',
        courseDescription: '',
        courseDescriptionLong: '',
        coursePrice: '',
        prerequisites: '',
        courseCode: '',
        thumbnail: '',
        tags: ''
    });

    const [courseLevel, setCourseLevel] = useState('');
    const [courseLanguage, setCourseLanguage] = useState('');
    const [visibility, setVisibility] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = getToken('educator');
    const navigate = useNavigate();

    if (!token) {
        return <Navigate to="/educator/login" />;
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setInputdata({
            ...inputdata,
            "thumbnail": file
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputdata({
            ...inputdata,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            ...inputdata,
            courseLevel,
            tags: inputdata.tags.split(','),
            prerequisites: inputdata.prerequisites.split(','),
            language: courseLanguage,
            discussionForum: true,
            visibility: visibility
        }

        if (formData.courseCode === "") {
            toast.error("Enter Course Code");
        }
        else if (formData.courseTitle === "") {
            toast.error("Enter Course Title");
        }
        else if (formData.courseDescription === "" || formData.courseDescription.length > 100) {
            toast.error("Enter Course short Description in less than 100 characters");
        }
        else if (formData.courseDescriptionLong === "") {
            toast.error("Enter Course Long Description.");
        }
        else if (formData.coursePrice === "" || formData.coursePrice < 0) {
            toast.error("Enter Valid Course Price.");
        }
        else {
            try {
                const response = await educreatecoursefunction(formData, token);

                if (response?.status === 201) {
                    setInputdata({
                        courseTitle: '',
                        courseDescription: '',
                        courseDescriptionLong: '',
                        coursePrice: '',
                        prerequisites: '',
                        courseCode: '',
                        thumbnail: '',
                        tags: ''
                    });
                    setCourseLevel('');
                    setCourseLanguage('');
                    setVisibility('');
                    toast.success("Course created successfully");
                    navigate("/educator/offered-courses");
                } else {
                    toast.error("Error in creating course");
                }
            } catch (error) {
                toast.error("An error occurred while creating the course");
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <>
            <div className="edu-create-course-container">
                <EdNavbar />
                <div className="create-course-wrapper">
                    <div className="create-course-card">
                        <h1 className="create-course-title">Create A New Course</h1>

                        <form className="create-course-form" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                {/* Row 1 */}
                                <div className="form-group">
                                    <label className="form-label">Course Title *</label>
                                    <input
                                        type="text"
                                        name="courseTitle"
                                        value={inputdata.courseTitle}
                                        onChange={handleChange}
                                        placeholder="e.g., Introduction to React"
                                        maxLength={40}
                                        className="form-input"
                                        required
                                    />
                                    <small className="form-hint">Max 40 characters</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Course Code *</label>
                                    <input
                                        type="text"
                                        name="courseCode"
                                        value={inputdata.courseCode}
                                        onChange={handleChange}
                                        placeholder="e.g., CS101"
                                        maxLength={10}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {/* Row 2 */}
                                <div className="form-group">
                                    <label className="form-label">Visibility *</label>
                                    <select
                                        name='visibility'
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select visibility</option>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Course Level *</label>
                                    <select
                                        name='courseLevel'
                                        value={courseLevel}
                                        onChange={(e) => setCourseLevel(e.target.value)}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select level</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                {/* Row 3 */}
                                <div className="form-group">
                                    <label className="form-label">Short Description *</label>
                                    <input
                                        type="text"
                                        value={inputdata.courseDescription}
                                        onChange={handleChange}
                                        placeholder="Brief description (max 100 chars)"
                                        name="courseDescription"
                                        maxLength={100}
                                        className="form-input"
                                        required
                                    />
                                    <small className="form-hint">{inputdata.courseDescription.length}/100 characters</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Course Price (Rs) *</label>
                                    <input
                                        type="number"
                                        value={inputdata.coursePrice}
                                        onChange={handleChange}
                                        placeholder="Enter price (0 for free)"
                                        name="coursePrice"
                                        className="form-input"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Row 4 */}
                                <div className="form-group">
                                    <label className="form-label">Prerequisites</label>
                                    <input
                                        name='prerequisites'
                                        type="text"
                                        value={inputdata.prerequisites}
                                        onChange={handleChange}
                                        placeholder="Comma separated prerequisites"
                                        maxLength={150}
                                        className="form-input"
                                    />
                                    <small className="form-hint">e.g., Basic HTML, JavaScript</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Course Language *</label>
                                    <select
                                        name='language'
                                        value={courseLanguage}
                                        onChange={(e) => setCourseLanguage(e.target.value)}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Select language</option>
                                        <option value="english">English</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Row 5 */}
                                <div className="form-group">
                                    <label className="form-label">Tags</label>
                                    <input
                                        name='tags'
                                        type="text"
                                        value={inputdata.tags}
                                        onChange={handleChange}
                                        placeholder="Comma separated tags"
                                        maxLength={35}
                                        className="form-input"
                                    />
                                    <small className="form-hint">e.g., programming,web,react</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Course Thumbnail</label>
                                    <div className="file-upload-wrapper">
                                        <label className="file-upload-label">
                                            <input
                                                type="file"
                                                name="thumbnail"
                                                accept='.png,.jpg,.jpeg'
                                                onChange={handleFileUpload}
                                                className="file-upload-input"
                                            />
                                            <span className="file-upload-text">
                                                {inputdata.thumbnail ? inputdata.thumbnail.name : "Choose an image..."}
                                            </span>
                                            <span className="file-upload-button">Browse</span>
                                        </label>
                                    </div>
                                    <small className="form-hint">Recommended: 1280x720px</small>
                                </div>

                                {/* Full width row */}
                                <div className="form-group full-width">
                                    <label className="form-label">Long Description *</label>
                                    <textarea
                                        name='courseDescriptionLong'
                                        value={inputdata.courseDescriptionLong}
                                        onChange={handleChange}
                                        placeholder="Detailed course description"
                                        maxLength={500}
                                        className="form-textarea"
                                        rows="4"
                                        required
                                    />
                                    <small className="form-hint">{inputdata.courseDescriptionLong.length}/500 characters</small>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default EduCreateCourse;