import React from "react"
import { Link } from "react-router-dom";
import useToken from "../utils/useToken"
import useLogout from "../utils/useLogout";

const Navbar = () => {
    const loggedIn = useToken()
    const logout = useLogout()
    return (
        <>
            <div>
                <Link to={"/"}>Home</Link>
                <Link to={"/message"}>Message</Link>
                {
                    !loggedIn ?
                        <div>
                            <Link to={"/login"}>Login</Link>
                            <Link to={"/register"}>Register</Link>
                        </div> : ""
                }
                <button onClick={logout}>Logout</button>
            </div>
        </>
    )
}

export default Navbar;
