import { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { InputGroup, Form, Button, Alert } from 'react-bootstrap';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function SearchCanvas({ chats, updateChats }) {
    const [show, setShow] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [error, setError] = useState("");
    const [token, setToken] = useState(null)
    const [currentUser, setCurrentUser] = useState(null);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);
        setCurrentUser(jwtDecode(token))

        const fetchAllUsers = async () => {
            const response = await axios.get("http://localhost:8000/api/v1/users", { headers: { Authorization: `Bearer ${token}` } });
            if (response.statusText !== "OK") setError(response.message);
            setAllUsers(response.data);
        };
        fetchAllUsers();
    }, []);

    useEffect(() => {
        // Flatten the array of users from all chat data
        const allChatUsers = chats.reduce((acc, chat) => [...acc, ...chat.users], []);

        // Get the array of unique user ids present in all chat's users
        const allChatUserIds = Array.from(new Set(allChatUsers.map(user => user._id)));

        // Filter out users who are not present in any of the chat's users
        const unmatchedUsers = allUsers.filter(user => !allChatUserIds.includes(user._id)).filter(user => user._id !== currentUser.id);

        // Filter matched users based on the search query
        const matchedUsers = unmatchedUsers.filter(user => user.userName.toLowerCase().includes(searchQuery.toLowerCase()));

        setSearchedUsers(matchedUsers);
    }, [searchQuery, allUsers, chats]);



    useEffect(() => {
        const timer = setTimeout(() => {
            setError("");
        }, 1000);

        return () => clearTimeout(timer);
    }, [error]);


    const handleOnSelectUser = async (user) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/createChat`, { isGroupChat: false, targetUser: user }, { headers: { Authorization: `Bearer ${token}` } })
            if (response.statusText !== "OK") {
                setError(`Cannot send message to ${user[0].userName}`);
            } else {
                handleClose()
                updateChats(response.data);
            }
        } catch (error) {
            setError(`Cannot send message to ${user[0].chatName}`);
        }
    }


    return (
        <>
            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}
            <Button variant="primary" onClick={handleShow} style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5" }}>
                New Chat
            </Button>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton style={{ backgroundColor: "#4F46E5", color: "white" }}>
                    <Offcanvas.Title>Search Users</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ backgroundColor: "#E0E7FF" }}>
                    <div className='position-fixed' style={{ width: "360px" }}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-sm">
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                                placeholder="Search User"
                            />
                        </InputGroup>
                    </div>
                    <div className='d-flex flex-column h-100 w-100 mt-5'>
                        {searchedUsers.length > 0 && (
                            searchedUsers.map((user) => {
                                return (
                                    <div className='d-flex flex-row align-items-center rounded ps-3 mb-3' key={user._id} style={{ height: "60px", cursor: "pointer", backgroundColor: "#4F46E5" }} onClick={() => handleOnSelectUser([user])}>
                                        <FaUserCircle color='white' size={45} />
                                        <p className='fs-5 ms-3 text-light'>{user.userName}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default SearchCanvas;
