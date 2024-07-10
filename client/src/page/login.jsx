import React, { useState, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = ({ setLoggedIn }) => {
    const [userEmail, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) navigate("/")
    }, [])

    const handelOnLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/v1/login", { email: userEmail, password })
            localStorage.setItem("token", response.data.token);
            setLoggedIn(true)
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
