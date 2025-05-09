import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { eduregisterfunction } from "../../../services/Apis";
import { Link, useNavigate } from "react-router-dom"
import { country_list } from "./../../../data/countries"
import "./Eduregister.css"
import { FaAngleLeft } from "react-icons/fa6";


const EduRegister = () => {
    const [paswordshow, setPaswordShow] = useState(false);
    const [inputdata, setInputdata] = useState({
        fname: "", lname: "", email: "", password: "", phone: "", dob: "",
        education: "", gender: "", username: "", location: "", bio: "",
        upiID: "", profilePic: ""
    });

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(inputdata.password);
    const hasCapitalLetter = /[A-Z]/.test(inputdata.password);
    const hasNumber = /\d/.test(inputdata.password);
    const homeBtnStyle = {
        position: 'absolute', top: '1rem', left: '0', color: 'white', background: 'transparent', border: 'none', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '4px'
    }

    const navigate = useNavigate();
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputdata({ ...inputdata, [name]: value });
    };

    const handleGenderChange = (e) => {
        setInputdata({ ...inputdata, gender: e.target.value });
    };

    const handlelocationChange = (e) => {
        setInputdata({ ...inputdata, location: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation...
        if (inputdata.fname === "") toast.error("Enter Your First Name");
        else if (inputdata.lname === "") toast.error("Enter Your Last Name");
        else if (inputdata.email === "") toast.error("Enter Your Email");
        else if (!inputdata.email.includes("@")) toast.error("Enter Valid Email");
        else if (inputdata.phone === "") toast.error("Enter Your Phone no.");
        else if (inputdata.dob === "") toast.error("Enter Your DOB");
        else if (inputdata.location === "") toast.error("Select Your Country");
        else if (inputdata.gender === "") toast.error("Select Your Gender");
        else if (inputdata.username === "") toast.error("Enter Desired Username");
        else if (inputdata.password === "") toast.error("Enter Your Password");
        else if (inputdata.password.length < 6) toast.error("Password must be at least 6 characters");
        else if (!hasSpecialChar) toast.error("Password must contain a special character");
        else if (!hasCapitalLetter) toast.error("Password must contain a capital letter");
        else if (!hasNumber) toast.error("Password must contain a number");
        else {
            const response = await eduregisterfunction(inputdata);
            if (response?.status === 201) {
                setInputdata({
                    fname: "", lname: "", email: "", password: "", phone: "",
                    dob: "", education: "", gender: "", username: "", location: "",
                    bio: "", upiID: "", profilePic: ""
                });
                navigate("/educator/login");
                toast.success("Register Successfully");
            } else if (response?.status === 409) {
                toast.error("Email or Phone already exists");
            } else {
                toast.error("Error in Register! Please try Again");
            }
        }
    };

    return (
        <div className='outerdiv'>
            <section className='register_section'>
                <div className="EDU_register_form_data" style={{ position: 'relative' }}>
                    <button style={homeBtnStyle} onClick={() => navigate('/')}><FaAngleLeft size={20} /> Home</button>
                    <div className="form_heading" >
                        <h1>Sign Up</h1>
                        <p>Welcome to Leranify</p>
                    </div>
                    <form className='EDU_register_form' encType='multipart/form-data'>
                        <div>
                            <label htmlFor="fname">First Name</label>
                            <input type="text" value={inputdata.fname} name="fname" onChange={handleChange} placeholder='Enter Your First Name' maxLength={15} />
                        </div>
                        <div>
                            <label htmlFor="lname">Last Name</label>
                            <input type="text" name="lname" value={inputdata.lname} onChange={handleChange} placeholder='Enter Your Last Name' maxLength={15} />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" value={inputdata.email} onChange={handleChange} placeholder='Enter Your Email Address' maxLength={320} />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input type="text" name="phone" value={inputdata.phone} onChange={handleChange} placeholder='Enter Your Phone no.' maxLength={10} />
                        </div>
                        <div>
                            <label htmlFor="bio">Bio</label>
                            <textarea name="bio" value={inputdata.bio} onChange={handleChange} rows={4} placeholder='Write few words about yourself' maxLength={250} />
                        </div>
                        <div>
                            <label htmlFor="upiID">Upi ID</label>
                            <input type="text" value={inputdata.upiID} name="upiID" onChange={handleChange} placeholder='Enter your upiID' maxLength={30} />
                        </div>
                        <div>
                            <label htmlFor="dob">DOB</label>
                            <input type="date" name="dob" value={inputdata.dob} onChange={handleChange} max={maxDate} />
                        </div>
                        <div>
                            <label htmlFor="gender">Gender</label>
                            <select name="gender" value={inputdata.gender} onChange={handleGenderChange}>
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="country">Country</label>
                            <select name="country" value={inputdata.location} onChange={handlelocationChange}>
                                <option value="">Select...</option>
                                {country_list.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input type="text" value={inputdata.username} name="username" onChange={handleChange} placeholder='Enter username' />
                        </div>
                        <div className='form-items'>
                            <label htmlFor="password">Password</label>
                            <input type={!paswordshow ? "password" : "text"} name="password" value={inputdata.password} onChange={handleChange} placeholder='Enter Your password' maxLength={20} />
                            <div className="showpass" onClick={() => setPaswordShow(!paswordshow)} >
                                {!paswordshow ? "Show" : "Hide"}
                            </div>
                        </div>
                        <button className="btn custom-btn" onClick={handleSubmit}>Sign Up</button>
                    </form>
                    <div className='form-footer'>
                        <p>Already have an account?</p>
                        <Link className="custom-link" to="/educator/login"> Login here</Link>
                    </div>
                </div>
                <ToastContainer />
            </section>
        </div>
    )
}

export default EduRegister;
