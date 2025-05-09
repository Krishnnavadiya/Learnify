import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { studentregisterfunction } from "../../../services/Apis";
import { Link, useNavigate } from "react-router-dom";
import "./studentregister.css";
import { country_list } from "./../../../data/countries"
import { FaAngleLeft } from "react-icons/fa6";


const StudentRegister = () => {
    const [paswordshow, setPaswordShow] = useState(false);
    const [inputdata, setInputdata] = useState({
        fname: "", lname: "", email: "", password: "", phone: "", dob: "",
        education: "", gender: "", username: "", location: ""
    });

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(inputdata.password);
    const hasCapitalLetter = /[A-Z]/.test(inputdata.password);
    const hasNumber = /\d/.test(inputdata.password);

    const navigate = useNavigate();
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    const homeBtnStyle = {
        position: 'absolute', top: '1rem', left: '0', color: 'white', background: 'transparent', border: 'none', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '4px'
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputdata({ ...inputdata, [name]: value });
    };

    const handleGenderChange = (e) => {
        setInputdata({ ...inputdata, gender: e.target.value });
    };

    const handleCountryChange = (e) => {
        setInputdata({ ...inputdata, location: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            const response = await studentregisterfunction(inputdata);
            if (response?.status === 201) {
                setInputdata({
                    fname: "", lname: "", email: "", password: "", phone: "",
                    dob: "", education: "", gender: "", username: "", location: ""
                });
                navigate("/student/login");
                toast.success("Registered Successfully");
            } else if (response?.status === 409) {
                toast.error("Credentials already exist");
            } else {
                toast.error("Something went wrong! Try again");
            }
        }
    };

    return (
        <div className='outerdiv'>
            <section className='register_section' >

                <div className="register_form_data" style={{ position: 'relative' }}>
                    <button style={homeBtnStyle} onClick={() => navigate('/')}><FaAngleLeft size={20} /> Home</button>
                    <div className="form_heading">
                        <h1>Sign Up</h1>
                        <p>Welcome to Learnify</p>
                    </div>
                    <form className='register_form'>
                        <div>
                            <label htmlFor="fname">First Name</label>
                            <input type="text" value={inputdata.fname} name="fname" onChange={handleChange} placeholder='Enter Your First Name' maxLength={15} />
                        </div>
                        <div>
                            <label htmlFor="lname">Last Name</label>
                            <input type="text" value={inputdata.lname} name="lname" onChange={handleChange} placeholder='Enter Your Last Name' maxLength={15} />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" value={inputdata.email} name="email" onChange={handleChange} placeholder='Enter Your Email Address' maxLength={320} />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input type="text" value={inputdata.phone} name="phone" onChange={handleChange} placeholder='Enter Your Phone no.' maxLength={10} />
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
                            <select name="country" value={inputdata.location} onChange={handleCountryChange}>
                                <option value="">Select...</option>
                                {country_list.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input type="text" value={inputdata.username} name="username" onChange={handleChange} placeholder='Enter username' maxLength={20} />
                        </div>
                        <div className='form-items'>
                            <label htmlFor="password">Password</label>
                            <input type={!paswordshow ? "password" : "text"} name="password" value={inputdata.password} onChange={handleChange} placeholder='Enter Your password' maxLength={20} />
                            <div className="showpass" onClick={() => setPaswordShow(!paswordshow)} >
                                {!paswordshow ? "Show" : "Hide"}
                            </div>
                        </div>
                    </form>
                    <button className="btn text-center custom-btn" onClick={handleSubmit}>Sign Up</button>
                    <div className='form-footer'>
                        <p>Already have an account ? </p>
                        <Link className='register_custom-link' to="/student/login"> Login here</Link>
                    </div>
                </div>
                <ToastContainer />
            </section>
        </div>
    )
}

export default StudentRegister;
