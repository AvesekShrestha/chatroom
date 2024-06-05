import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const Home = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token) navigate("/login");
        else {
            const data = jwtDecode(token)
            setUser(data);
        }

    }, [])

    return (
        <>
            {
                user &&
                <div>
                    <p>Name :{user.email} </p>
                    <p>User Id :{user.id} </p>
                </div>
            }

        </>
    )
}

export default Home;
