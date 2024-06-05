import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux"
import { jwtDecode } from "jwt-decode";

const Message = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [isSelected, setIsSelected] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const user = useSelector((state) => state.user.userData)


    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        const token = localStorage.getItem("token")
        const user = jwtDecode(token)

        newSocket.emit("addUser", user);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("getUsers", async (usersList) => {
                const fetchedUsers = await Promise.all(usersList.map(async (element) => {
                    const response = await axios.get(`http://localhost:8000/api/v1/user/${element.userId}`);
                    return response.data[0];
                }));

                const filterdUsers = fetchedUsers.filter((element) => element._id !== user.id)
                setUsers(filterdUsers);
            });

            return () => {
                socket.off("getUsers");
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            const handleMessage = (data) => {
                console.log(data);
            };
            socket.on("message", handleMessage);
            return () => {
                socket.off("message", handleMessage);
            };
        }
    }, [socket]);

    const handleOnSend = () => {
        if (socket && socket.connected) {
            socket.emit("send message", { to: selectedUser, message });
            setMessage("");
        } else {
            console.error("Socket is not connected");
        }
    };

    const handleOnSelect = (element) => {
        setIsSelected(true);
        setSelectedUser(element._id);
    }

    return (
        <>
            <div style={{ width: "100vw" }} className="d-flex justify-content-center align-items-center flex-column">
                <div className="d-flex flex-row justify-content-between" style={{ height: "90vh", width: "100vw" }}>
                    <div className="d-flex flex-column justify-content-between">
                        <div>
                            This is for chat section
                        </div>
                        {isSelected &&

                            <div className="d-flex flex-row justify-content-around" style={{ width: "80vw" }}>
                                <div>
                                    <label htmlFor="message">Message:</label>
                                    <input
                                        type="text"
                                        style={{ width: "60vw", height: "50px" }}
                                        className="fs-4"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex align-items-center">

                                    <button className="btn btn-primary" style={{ width: "130px" }} onClick={handleOnSend}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="d-flex flex-column rounded" style={{ width: "20vw", border: "1px solid grey" }}>
                        {
                            users && users.map((element, index) => (

                                <div key={index} className="bg-primary mb-3 text-light d-flex justify-content-center align-items-center" style={{ height: "50px", width: "inherit", cursor: "pointer" }} onClick={() => handleOnSelect(element)}>
                                    <p>{element.userName}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Message;
