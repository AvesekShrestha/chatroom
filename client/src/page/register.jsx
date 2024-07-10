import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/socket';

const Register = ({ setLoggedIn, user }) => {
    const [userFormData, setUserFormData] = useState({ userName: '', email: '', password: '' });
    const navigate = useNavigate();
    const socket = useSocket()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/');
    }, [navigate]);

    const handleOnRegister = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/register', userFormData);
            localStorage.setItem('token', response.data.token);
            setUserFormData({ userName: '', email: '', password: '' });

            if (response.status === 200) {
                setLoggedIn(true);

                socket.emit("account creation", response.data.user)
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="d-flex justify-content-around align-items-center flex-column" style={{ height: '100vh', width: '100vw' }}>
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
    );
};

export default Register;
