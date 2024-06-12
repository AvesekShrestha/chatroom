import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ModalButton from "../component/Model";
import SearchCanvas from "../component/Offcanvas";
import MessageArea from "../component/MessageArea";
import { FaUserCircle } from "react-icons/fa";
import io from "socket.io-client"

const Message = () => {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatSelected, setChatSelected] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null)
  const selectedChatRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    const user = jwtDecode(token);
    setCurrentUser(user);

    const fetchChats = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/v1/fetchRelatedChats/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats(response.data);
    };
    fetchChats();

    const socket = io(`http://localhost:5000`);
    setSocket(socket)

    socket.emit("setup", user)

    return () => {
      socket.disconnect()
    }
  }, []);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);


  useEffect(() => {
    socket?.on("message received", handleMessageReceived);

    return () => {
      socket?.off("message received", handleMessageReceived);
    };
  }, [socket]);

  const handleMessageReceived = (newMessageReceived) => {
    const selectedChat = selectedChatRef.current;
    if (selectedChat && selectedChat._id === newMessageReceived.chatId._id) {
      setMessages(prevMessage => [...prevMessage, newMessageReceived]);
    } else {
      console.log("New message");
    }
  };



  const handleOnSelectChat = async (chat) => {
    setChatSelected(true);
    setSelectedChat(chat);
    try {
      const fetchMessages = async () => {
        const response = await axios.get(
          `http://localhost:8000/api/v1/fetchMessages/${chat._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
        if (response.statusText !== "OK") setError(response.data.message);
      };
      fetchMessages();
    } catch (error) {
      setError("Unable to load messages");
    }
    socket.emit("join chat", chat._id)
  };



  const updateChats = (newChat) => {
    setChats(prevChats => [...prevChats, newChat]);
    setChatSelected(true);
    setSelectedChat(newChat);
    handleOnSelectChat(newChat);
  };

  return (
    <div className="container-fluid" style={{ height: "90vh", width: "100vw" }}>
      <div className="row h-100 no-gutters">
        <div className="col-3 p-0" style={{ backgroundColor: "#F8F9FA" }}>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <h3>Chats</h3>
            <ModalButton chats={chats} updatechats={updateChats} />
          </div>
          <div className="w-75">
            <SearchCanvas chats={chats} updatechats={updateChats} />
          </div>
          <hr />
          <div className="d-flex flex-column" style={{ height: "80vh", overflowY: "scroll" }}>
            {chats.length > 0 && chats.map((chat) => (
              <div
                className="w-100 d-flex align-items-center ps-3"
                style={{
                  backgroundColor: "#4F46E5",
                  height: "65px",
                  cursor: "pointer",
                  border: "1px solid #D1D5DB",
                }}
                key={chat._id}
                onClick={() => handleOnSelectChat(chat)}
              >
                <span className="me-5">
                  <FaUserCircle size={50} color="white" />
                </span>
                <p key={chat._id} className="fs-5 text-light">
                  {!chat.isGroupChat
                    ? chat.users.filter((user) => user._id !== currentUser.id)[0].userName
                    : chat.chatName}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-9 p-0" style={{ backgroundColor: "#E0E7FF" }}>
          {chatSelected && <MessageArea chat={selectedChat} messages={messages} socket={socket} setMessages={setMessages} />}
        </div>
      </div>
    </div>
  );
};

export default Message;
