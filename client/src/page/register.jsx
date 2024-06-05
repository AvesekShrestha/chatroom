import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../store/action/userAction";
import { useDispatch, useSelector } from "react-redux";
// import useToken from "../utils/useToken";

const Register = () => {
    const [userFormData, setUserFormData] = useState({ userName: "", email: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const loggedIn = useToken()

    // useEffect(() => {
    //     if (loggedIn) navigate("/");
    // }, [])

    const handleOnRegister = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/v1/register", userFormData);
            localStorage.setItem("token", response.data.token);
            setUserFormData({ userName: "", email: "", password: "" });
            const { _id, userName, email } = response.data.user;
            dispatch(setUserData({ id: _id, userName, email }));
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <>
            <div className="d-flex justify-content-around align-items-center flex-column" style={{ height: "100vh", width: "100vw" }}>
                <div>
                    <label htmlFor="userName">User Name:</label>
                    <input type="text" value={userFormData.userName} onChange={handleOnChange} name="userName" id="userName" />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={userFormData.email} onChange={handleOnChange} name="email" id="email" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="text" value={userFormData.password} onChange={handleOnChange} name="password" id="password" />
                </div>
                <button className="btn btn-primary" onClick={handleOnRegister}>Register</button>
            </div>
        </>
    );
};

export default Register;
