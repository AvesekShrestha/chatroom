import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import { Form, InputGroup } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function MyVerticallyCenteredModal(props) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchedUsers, setSearchedUsers] = useState([]);
	const [relatedUsers, setRelatedUsers] = useState([]);
	const [token, setToken] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		setToken(token);
		const loggedInUser = jwtDecode(token);
		setCurrentUser(loggedInUser);

		const fetchRelatedUsers = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8000/api/v1/fetchRelatedUsers/${loggedInUser.id}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setRelatedUsers(response.data);
			} catch (error) {
				console.log("Error occurred");
			}
		};
		fetchRelatedUsers();
	}, []);

	useEffect(() => {
		const filteredUsers = relatedUsers.filter(
			(user) =>
				user.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!selectedUsers.some((selectedUser) => selectedUser._id === user._id)
		);
		setSearchedUsers(filteredUsers);
	}, [searchQuery, relatedUsers, selectedUsers]);

	const handleOnSelectUser = (user) => {
		setSelectedUsers((prevUsers) => [...prevUsers, user]);
		setSearchedUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
	};

	const handleOnDeselect = (user) => {
		setSearchedUsers((prevUsers) => [...prevUsers, user]);
		setSelectedUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
	};

	const handleOnCreateGroup = async () => {
		try {
			if (selectedUsers.length < 2) throw new Error("You must select at least two users to create a group.");
			const response = await axios.post(
				`http://localhost:8000/api/v1/createChat`,
				{ isGroupChat: true, chatName: groupName, targetUser: selectedUsers },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			props.onHide();
			props.updatechats(response.data);
		} catch (error) {
			console.log("Error on creating group:", error.message);
		}
	};

	return (
		<Modal
			{...props}
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
						selectedUsers.map((user) => (
							<div
								style={{ height: "40px", minWidth: "60px", cursor: "pointer" }}
								className="bg-primary d-flex align-items-center rounded p-2 me-2"
								key={user._id}
								onClick={() => handleOnDeselect(user)}
							>
								<p className="text-light m-0">{user.userName}</p>
							</div>
						))}
				</div>
				<hr />
				<div className="d-flex flex-column">
					{searchedUsers.length > 0 &&
						searchedUsers.map((user) => (
							<div
								className="d-flex flex-row ps-3 bg-primary mb-2 rounded w-50 align-items-center"
								style={{ cursor: "pointer", height: "50px" }}
								key={user._id}
								onClick={() => handleOnSelectUser(user)}
							>
								<FaUserCircle size={40} color="white" />
								<span className="ms-3 fs-5 text-light text-center">
									{user.userName}
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
