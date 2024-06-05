import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";

const Wrapper = ({ children }) => {
    const location = useLocation();
    const shouldShowNavbar = !['/login', '/register'].includes(location.pathname);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {shouldShowNavbar && (
                <div>
                    <Navbar />
                </div>
            )}
            <div>
                {children}
            </div>
        </div>
    );
};

export default Wrapper;
