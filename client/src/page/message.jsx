import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ModalButton from "../component/Model";
import SearchCanvas from "../component/Offcanvas";
import MessageArea from "../component/MessageArea";
import { FaUserCircle } from "react-icons/fa";
import { useSocket } from "../context/socket";
import CallHandler from "../component/CallHandler";

const Message = () => {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatSelected, setChatSelected] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const selectedChatRef = useRef(null);
  const [missedMessages, setMissedMessages] = useState(() => {
    const savedMissedMessages = localStorage.getItem("missedMessages");
    return savedMissedMessages ? JSON.parse(savedMissedMessages) : {};
  });
  const [offer, setOffer] = useState(null)
  const [caller, setCaller] = useState(null);
  const [callChat, setCallChat] = useState(null)
  const socket = useSocket();

  useEffect(() => {
    localStorage.setItem("missedMessages", JSON.stringify(missedMessages));
  }, [missedMessages]);

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
  }, []);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const handleGroupCreated = (data) => {
      setChats((prevChats) => [...prevChats, data]);
    };

    const handleChatRequest = async (data) => {
      setChats((prevChats) => [...prevChats, data]);
    };

    const handleIncommingCall = async (data) => {
      const { chat, from, offer } = data;
      setOffer(offer);
      setCaller(from);
      setCallChat(chat);
    };

    const handleMessageReceived = (newMessageReceived) => {
      const selectedChat = selectedChatRef.current;
      if (selectedChat && selectedChat._id === newMessageReceived.chatId._id) {
        setMessages((prevMessage) => [...prevMessage, newMessageReceived]);
      } else {
        setMissedMessages((prevMissedMessages) => ({
          ...prevMissedMessages,
          [newMessageReceived.chatId._id]: (prevMissedMessages[newMessageReceived.chatId._id] || 0) + 1,
        }));
      }
      updateLatestMessage(newMessageReceived);
    };

    socket?.on("message received", handleMessageReceived);
    socket?.on("incomming call", handleIncommingCall);
    socket?.on("chat request response", handleChatRequest);
    socket?.on("group created", handleGroupCreated);

    return () => {
      socket?.off("message received", handleMessageReceived);
      socket?.off("incomming call", handleIncommingCall);
      socket?.off("group created", handleGroupCreated);
    };
  }, [socket]);

  const handleOnSelectChat = async (chat) => {
    setChatSelected(true);
    setSelectedChat(chat);
    setMissedMessages((prevMissedMessages) => {
      const newMissedMessages = { ...prevMissedMessages };
      delete newMissedMessages[chat._id];
      return newMissedMessages;
    });

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
    socket?.emit("join chat", chat._id);
  };

  const updateChats = (newChat) => {
    setChats((prevChats) => [...prevChats, newChat]);
    setChatSelected(true);
    setSelectedChat(newChat);
    handleOnSelectChat(newChat);
  };

  const updateLatestMessage = (newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === newMessage.chatId._id
          ? { ...chat, latestMessage: newMessage }
          : chat
      )
    );
  };

  return (
    <div className="container-fluid" style={{ height: "90vh", width: "100vw" }}>
      <div className="row h-100 no-gutters">
        {offer && <CallHandler caller={caller} offer={offer} chat={callChat} />}
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
            {chats.length > 0 &&
              chats.map((chat) => (
                <div
                  className="w-100 d-flex ps-3 flex-column"
                  style={{
                    backgroundColor: "#4F46E5",
                    height: "65px",
                    cursor: "pointer",
                    border: "1px solid #D1D5DB",
                  }}
                  key={chat._id}
                  onClick={() => handleOnSelectChat(chat)}
                >
                  <div className="d-flex flex-row align-items-center justify-content-between mt-1">
                    <div className="d-flex flex-row">
                      <span className="me-3">
                        <FaUserCircle size={50} color="white" />
                      </span>
                      <div className="d-flex flex-column">
                        <p key={chat._id} className={`fs-5 text-light m-0 ${missedMessages[chat._id] ? "" : "opacity-75"}`}>
                          {!chat.isGroupChat
                            ? chat.users.filter((user) => user._id !== currentUser.id)[0].userName
                            : chat.chatName}
                        </p>
                        <div className="d-flex flex-row">
                          {chat.latestMessage && (
                            <div>
                              <span className={`text-light ${missedMessages[chat._id] ? "" : "opacity-75"}`} style={{ fontSize: "12px" }}>
                                {chat.latestMessage.sender._id === currentUser.id ? "You" : chat.latestMessage.sender.userName} :{" "}
                              </span>
                              <span className={`text-light ${missedMessages[chat._id] ? "" : "opacity-75"}`} style={{ fontSize: "12px" }}>
                                {chat.latestMessage.content.length > 30 ? chat.latestMessage.content.slice(0, 30) + "..." : chat.latestMessage.content}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {missedMessages[chat._id] ? <span className="text-light me-4">{missedMessages[chat._id]}</span> : ""}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="col-9 p-0" style={{ backgroundColor: "#E0E7FF" }}>
          {chatSelected && (
            <MessageArea
              chat={selectedChat}
              messages={messages}
              setMessages={setMessages}
              updateLatestMessage={updateLatestMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Message;
