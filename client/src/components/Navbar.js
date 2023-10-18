import React from 'react'
import {BiPhoneCall , BiVideo} from 'react-icons/bi';
import {FaUserPlus} from 'react-icons/fa';
import {IoMdNotifications} from "react-icons/io"
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ width: "100%" }}>
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                            <Link to={"/"}><li className="nav-item me-4 " style={{cursor : "pointer"}}>
                                <BiPhoneCall size={25} color='green'/>
                            </li></Link>
                            <Link to={"/"}><li className="nav-item me-4" style={{cursor : "pointer"}} >
                                <BiVideo size={25} color='green'/>
                            </li></Link>
                            <Link to={"/"}><li className="nav-item me-4" style={{cursor : "pointer"}}>
                                <FaUserPlus size={25} color='green'/>
                            </li></Link>
                            <Link to={"/"}><li className="nav-item me-4" style={{cursor : "pointer"}} >
                                <IoMdNotifications size={25} color='green'/>
                            </li></Link>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        </form>
                    </div>
                </div>
            </nav>
        </>
    )
}
