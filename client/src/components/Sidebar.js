import React from 'react'
import { Link, useLocation } from 'react-router-dom';
export default function Sidebar() {
    const location = useLocation();
    return (
        <>
            <div className="d-flex flex-column flex-shrink-0  bg-light" style={{ width: "100%", height: "100vh" }}>
                <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <svg className="bi me-2" width="40" height="32"><use xlinkHref="/" /></svg>
                    <span className="fs-4">Chat Room</span>
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active text-light" : "text-dark"}`} aria-current="page">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="/" /></svg>
                            Chat
                        </Link>
                    </li>
                    <li>
                        <Link to="/sidebar" className={`nav-link link-dark ${location.pathname === "/navbar" ? "active text-light" : ""}`}>
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="/" /></svg>
                            Friends
                        </Link>
                    </li>
                    <li>
                        <Link to="/order" className={`nav-link link-dark ${location.pathname === '/order' ? "active text-light" : ""}`}>
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="/" /></svg>
                            Orders
                        </Link>
                    </li>
                    <li>
                        <a href="/sidebar" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="/" /></svg>
                            Products
                        </a>
                    </li>
                    <li>
                        <a href="/sidebar" className="nav-link link-dark">
                            <svg className="bi me-2" width="16" height="16"><use xlinkHref="/" /></svg>
                            Customers
                        </a>
                    </li>
                </ul>
                <hr />
                <div className="dropdown">
                    <a href="/sidebar" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                        <strong>mdo</strong>
                    </a>
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                        <li><a className="dropdown-item" href="/">New project...</a></li>
                        <li><a className="dropdown-item" href="/">Settings</a></li>
                        <li><a className="dropdown-item" href="/">Profile</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="/">Sign out</a></li>
                    </ul>
                </div>
            </div>

        </>
    )
}
