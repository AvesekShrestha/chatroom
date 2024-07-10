import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useChat = (socket) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [token, setToken] = useState(null);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);
        const user = jwtDecode(token);
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/chat", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChats(response.data);
            } catch (error) {
                console.error("Unable to fetch chats", error);
            }
        };

        fetchChats();
    }, [token]);

    useEffect(() => {
        if (!selectedChat) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/message/${selectedChat._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(response.data);
            } catch (error) {
                console.error("Unable to fetch messages", error);
            }
        };

        fetchMessages();
    }, [selectedChat, token]);

    const sendMessage = async (messageContent) => {
        if (!selectedChat || !messageContent.trim()) return;

        const messageToSend = {
            chatId: selectedChat._id,
            sender: currentUser,
            content: messageContent,
        };

        try {
            const response = await axios.post("http://localhost:8000/api/v1/message/sendMessage", messageToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.statusText !== "OK") {
                return;
            }

            const newMessage = response.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit("new message", newMessage);
        } catch (error) {
            console.error("Unable to send message", error);
        }
    };

    const updateChats = (newChat) => {
        setChats((prevChats) => [...prevChats, newChat]);
    };

    const updateLatestMessage = (newMessage) => {
        setChats((prevChats) =>
            prevChats.map((chat) => (chat._id === newMessage.chat._id ? { ...chat, latestMessage: newMessage } : chat))
        );
    };

    return {
        chats,
        selectedChat,
        messages,
        setSelectedChat,
        sendMessage,
        updateChats,
        updateLatestMessage,
    };
};

export default useChat;
