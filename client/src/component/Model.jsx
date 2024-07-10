import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import { Form, InputGroup } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useSocket } from "../context/socket";

function MyVerticallyCenteredModal(props) {
	const { chats, updatechats, ...modalProps } = props;
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState("");
	const [currentUser, setCurrentUser] = useState(null);
	const socket = useSocket()

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setCurrentUser(jwtDecode(token));
		}
	}, [props.chats]);

	useEffect(() => {
		if (currentUser && chats.length > 0) {
			const filteredUsers = chats.filter(
				(chat) =>
					!chat.isGroupChat &&
					chat.users.some(user => user._id !== currentUser.id && user.userName.toLowerCase().includes(searchQuery.toLowerCase())) &&
					!selectedUsers.some((selectedUser) => selectedUser._id === chat._id)
			);
			setSearchedUsers(filteredUsers);
		}
	}, [searchQuery, chats, selectedUsers, currentUser]);

	const handleOnSelectUser = (chat) => {
		setSelectedUsers((prevUsers) => [...prevUsers, chat]);
		setSearchedUsers((prevUsers) => prevUsers.filter((u) => u._id !== chat._id));
	};

	const handleOnDeselect = (chat) => {
		setSearchedUsers((prevUsers) => [...prevUsers, chat]);
		setSelectedUsers((prevUsers) => prevUsers.filter((u) => u._id !== chat._id));
	};

	const handleOnCreateGroup = async () => {
		try {
			if (selectedUsers.length < 2) throw new Error("You must select at least two users to create a group.");
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`http://localhost:8000/api/v1/createChat`,
				{ isGroupChat: true, chatName: groupName, targetUser: selectedUsers },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			props.onHide();
			updatechats(response.data);
			socket.emit("create group" , response.data)
		} catch (error) {
			console.log("Error on creating group:", error.message);
		}
	};

	return (
		<Modal
			{...modalProps}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Create Group Chat
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="d-flex flex-column justify-content-between">
					<div className="w-100 d-flex flex-row justify-content-between">
						<div className="w-50">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">Add User</InputGroup.Text>
								<Form.Control
									aria-label="Small"
									aria-describedby="inputGroup-sizing-sm"
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search User"
								/>
							</InputGroup>
						</div>
						<button
							className="btn btn-primary"
							style={{ width: "150px", height: "40px" }}
							onClick={handleOnCreateGroup}
						>
							Create Group
						</button>
					</div>
					<div className="w-50">
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Text id="inputGroup-sizing-sm">Group Name</InputGroup.Text>
							<Form.Control
								aria-label="Small"
								aria-describedby="inputGroup-sizing-sm"
								onChange={(e) => setGroupName(e.target.value)}
								placeholder="Enter group name"
							/>
						</InputGroup>
					</div>
				</div>
				<hr />
				<div style={{ minHeight: "80px" }} className="d-flex flex-row">
					{selectedUsers.length > 0 &&
						selectedUsers.map((chat) => (
							<div
								style={{ height: "40px", minWidth: "60px", cursor: "pointer" }}
								className="bg-primary d-flex align-items-center rounded p-2 me-2"
								key={chat._id}
								onClick={() => handleOnDeselect(chat)}
							>
								<p className="text-light m-0">{chat.users.filter(user => user._id !== currentUser.id)[0]?.userName}</p>
							</div>
						))}
				</div>
				<hr />
				<div className="d-flex flex-column">
					{searchedUsers.length > 0 &&
						searchedUsers.map((chat) => (
							<div
								className="d-flex flex-row ps-3 bg-primary mb-2 rounded w-50 align-items-center"
								style={{ cursor: "pointer", height: "50px" }}
								key={chat._id}
								onClick={() => handleOnSelectUser(chat)}
							>
								<FaUserCircle size={40} color="white" />
								<span className="ms-3 fs-5 text-light text-center">
									{chat.users.filter(user => user._id !== currentUser.id)[0]?.userName}
								</span>
							</div>
						))}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide} className="btn-primary">
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ModalButton({ chats, updatechats }) {
	const [modalShow, setModalShow] = useState(false);
	return (
		<>
			<FaPlus size={20} style={{ cursor: "pointer" }} onClick={() => setModalShow(true)} className="me-3" />
			<MyVerticallyCenteredModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				chats={chats}
				updatechats={updatechats}
			/>
		</>
	);
}

export default ModalButton;
