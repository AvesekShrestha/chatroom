import React, { useEffect, useState, useRef } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaArrowAltCircleRight, FaPhotoVideo, FaMicrophone, FaUserCircle } from "react-icons/fa";
import { BiLink } from "react-icons/bi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import { useSocket } from "./SocketProvider";

const MessageArea = ({ chat, messages, setMessages, updateLatestMessage, socket }) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [token, setToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const messageEndRef = useRef(null);
    // const socket = useSocket()

    useEffect(() => {
        const token = localStorage.getItem("token");
        setCurrentUser(jwtDecode(token));
        setToken(token);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleOnSend = async () => {
        let response;
        try {
            response = await axios.post(
                `http://localhost:8000/api/v1/sendMessage/${chat._id}`,
                { content: message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.statusText !== "OK") setError(response.data.message);
            else {
                setSuccess("Message sent");
                const newMessage = response.data;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                updateLatestMessage(newMessage);  // Update the latest message in the chat list
            }
            setMessage("");
        } catch (error) {
            setError("Error on sending message");
        }
        socket.emit("new message", response.data);
    };

    const handleOnKeyDown = (event) => {
        if (event.key === "Enter") handleOnSend();
    };

    return (
        <>
            <div className="d-flex flex-column" style={{ height: "90vh" }}>
                {/* chat head */}
                <div style={{ height: "65px", backgroundColor: "#D0D7EF" }} className="w-100 d-flex flex-row align-items-center ps-3">
                    <div>
                        <FaUserCircle color="white" size={50} />
                    </div>
                    <div className="ms-4 d-flex flex-column justify-content-center align-items-center">
                        <h4 className="text-dark mt-1 mb-0">{chat.isGroupChat ? chat.chatName : chat.users.filter(user => user._id !== currentUser?.id)[0].userName}</h4>
                        <div className="d-flex flex-row">
                            {
                                chat.users.map((user) => (
                                    <p key={user._id}>{`${user.userName}, `}</p>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* message area */}
                <div className="container d-flex flex-column" style={{ height: "80vh", overflowY: "scroll", paddingBottom: "30px", marginTop: "10px" }}>
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                className={`d-flex ${message.sender._id === currentUser.id ? "justify-content-end" : "justify-content-start"} mb-1`}
                                key={message._id}
                            >
                                <div
                                    className="bg-primary text-light text-wrap rounded p-2"
                                    style={{
                                        maxWidth: "350px",
                                        width: "fit-content",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    <p className="m-0">{message.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex justify-content-center align-items-center">
                            <p className="text-dark text-center">{`Start your conversation with ${chat.chatName}`}</p>
                        </div>
                    )}
                    <div ref={messageEndRef}></div>
                </div>
                {/* text area */}
                <div className="d-flex flex-row position-fixed bottom-0 bg-white" style={{ width: "100vw" }}>
                    <div className="ms-5" style={{ width: "50vw" }}>
                        <InputGroup style={{ cursor: "pointer" }} size="md" className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-sm">
                                <FaMicrophone />
                            </InputGroup.Text>
                            <InputGroup.Text id="inputGroup-sizing-sm" style={{ cursor: "pointer" }}>
                                <BiLink />
                            </InputGroup.Text>
                            <InputGroup.Text id="inputGroup-sizing-sm" style={{ cursor: "pointer" }}>
                                <FaPhotoVideo />
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="Medium"
                                aria-describedby="inputGroup-sizing-md"
                                placeholder="Message"
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                                onKeyDown={handleOnKeyDown}
                            />
                            <InputGroup.Text id="inputGroup-sizing-md" style={{ cursor: "pointer" }} onClick={handleOnSend}>
                                <FaArrowAltCircleRight />
                            </InputGroup.Text>
                        </InputGroup>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageArea;
