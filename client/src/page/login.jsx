import React, { useState, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../store/action/userAction";

const Login = () => {
    const [userEmail, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) navigate("/")
    }, [])

    const handelOnLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/v1/login", { email: userEmail, password })
            const { _id, userName, email } = response.data.user;
            localStorage.setItem("token", response.data.token);
            dispatch(setUserData({ id: _id, userName, email }))
            navigate("/");
        } catch (error) {
            console.log("Erorr while login");
        }
    }

    return (
        <>
            <label htmlFor="email">Email:</label>
            <input type="email" value={userEmail} onChange={(e) => setEmail(e.target.value)} id="email" />

            <label htmlFor="password">Password:</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} id="password" />

            <button className="btn btn-primary" onClick={handelOnLogin}>Login</button>

        </>
    )
}

export default Login;
