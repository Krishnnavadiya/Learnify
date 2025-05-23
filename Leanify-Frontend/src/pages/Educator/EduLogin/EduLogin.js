import React, { useState } from 'react'
import { NavLink, Navigate, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import { eduloginfunction } from '../../../services/Apis';
import style from "../../student/studentLogin/studentlogin.module.css";
import "./edulogin.css";
import Cookies from 'js-cookie';
import getToken from './../../../services/getToken'
import { FaAngleLeft } from "react-icons/fa6";

const EduLogin = () => {

    const [inputdata, setInputdata] = useState({
        email: "",
        password: ""
    });
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(inputdata.password);
    const hasCapitalLetter = /[A-Z]/.test(inputdata.password);
    const hasNumber = /\d/.test(inputdata.password);

    const [paswordshow, setPaswordShow] = useState(false);
    const navigate = useNavigate();

    const homeBtnStyle = {
        position: 'absolute', top: '1rem', left: '0', color: 'white', background: 'transparent', border: 'none', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '4px'
    }

    const token = getToken('educator');
    if (token) {
        return <Navigate to="/educator/dashboard" />
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputdata({
            ...inputdata,
            [name]: value
        })
    }

    // sendotp
    const sendOtp = async (e) => {
        e.preventDefault();

        if (inputdata.email === "") {
            toast.error("Enter Your Email !")
        } else if (!inputdata.email.includes("@")) {
            toast.error("Enter Valid Email !")
        } else if (inputdata.password === "") {
            toast.error("Enter Your Password")
        } else if (inputdata.password.length < 6) {
            toast.error("password length minimum 6 character")
        } else {
            const data = {
                email: inputdata.email,
                password: inputdata.password
            }

            const response = await eduloginfunction(data);
            // //console.log(response)

            if (response?.status === 200) {
                toast.success("Login Successfully");
                if (response?.data?.token) Cookies.remove('token')
                Cookies.set('token', response?.data?.token, { expires: 7, secure: true });

                setTimeout(() => {
                    navigate("/educator/dashboard")
                    window.location.reload();
                }, 1000);

            }
            else if (response?.status === 404) {
                toast.error("User does not exist");
            }
            else if (response?.status === 400) {
                toast.error("Wrong Password");
            }
            else if (!hasSpecialChar) {
                toast.error("Password must contain at least one special character");
            } else if (!hasCapitalLetter) {
                toast.error("Password must contain at least one capital letter");
            } else if (!hasNumber) {
                toast.error("Password must contain at least one number");
            }
            else {
                toast.error("Invalid Email or Password");
            }

        }
    }




    return (
        <div className={style.outerdiv}>
            <section className={style.section}>
                <div className="imgBox">
                    <img src='../images/eductor_login.jpg'></img>
                </div>
                <div className={style.form_data} style={{ position: 'relative' }}>
                    <button style={homeBtnStyle} onClick={() => navigate('/')}><FaAngleLeft size={20} /> Home</button>

                    <div className={style.form_heading}>
                        <h1>Welcome Back, Log In</h1>
                        <p>Hi, we are glad you are back. Please login.</p>
                    </div>
                    <form style={{ maxWidth: '400px' }}>
                        <div className={style.form_input}>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="" onChange={handleChange} placeholder='Enter Your Email Address' maxLength={240} />
                        </div>
                        <div className={style.form_input}>
                            <label htmlFor="password">Password</label>
                            <div className='two'>
                                <input type={!paswordshow ? "password" : "text"} name="password" onChange={handleChange} placeholder='Enter Your password' maxLength={20} />
                                <div className={style.showpass} onClick={() => setPaswordShow(!paswordshow)} >
                                    {!paswordshow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>
                        <button className={style.btn} onClick={sendOtp}>Login</button>
                        <p>Don't have an account <NavLink to="/educator/register">Sign up</NavLink> </p>
                        <p> <NavLink to="/educator/forgetpassword">Forget Password</NavLink> </p>
                    </form>
                </div>
                <ToastContainer />
            </section>
        </div>
    )
}

export default EduLogin
