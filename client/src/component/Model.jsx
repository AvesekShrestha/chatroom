// import React, { useEffect, useState } from "react";
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import axios from "axios";
// import { jwtDecode } from "jwt-decode"; // Ensure correct import

// function MyVerticallyCenteredModal(props) {
// 	const [users, setUsers] = useState([]);
// 	const [groupName, setGroupName] = useState("");
// 	const [userName, setUserName] = useState("");
// 	const [searchedUser, setSearchedUser] = useState([]);
// 	const [selectedUser, setSelectedUser] = useState([]);
// 	const [currentUser, setCurrentUser] = useState([]);

// 	useEffect(() => {
// 		const fetchUsers = async () => {
// 			const response = await axios.get("http://localhost:8000/api/v1/users");
// 			const token = localStorage.getItem("token");
// 			const decodedData = jwtDecode(token);
// 			setCurrentUser(decodedData);
// 			const userId = decodedData.id;
// 			const filteredData = response.data.filter(user => user._id !== userId);
// 			setUsers(filteredData);
// 		};

// 		fetchUsers();
// 	}, []);

// 	useEffect(() => {
// 		const searchingUser = users.filter((user) =>
// 			user.userName.toLowerCase().includes(userName.toLowerCase())
// 		);
// 		const filteredSearch = searchingUser.filter((user) =>
// 			!selectedUser.some(selected => selected._id === user._id)
// 		);
// 		setSearchedUser(filteredSearch);
// 	}, [userName, users, selectedUser]);

// 	const handleOnSelect = (element) => {
// 		setSelectedUser((prevSelectedUser) => {
// 			if (prevSelectedUser.find((u) => u._id === element._id)) {
// 				return prevSelectedUser;
// 			} else {
// 				return [...prevSelectedUser, element];
// 			}
// 		});

// 		setSearchedUser((prevSearchedUser) =>
// 			prevSearchedUser.filter((user) => user._id !== element._id)
// 		);
// 	};

// 	const handleOnDeselect = (element) => {
// 		setSelectedUser((prevSelectedUser) =>
// 			prevSelectedUser.filter((user) => user._id !== element._id)
// 		);

// 		setSearchedUser((prevSearchedUser) => {
// 			if (prevSearchedUser.find((u) => u._id === element._id)) {
// 				return prevSearchedUser;
// 			} else {
// 				return [...prevSearchedUser, element];
// 			}
// 		});
// 	};

// 	const handleOnCreateGroup = () => {

// 		if (selectedUser.length == 0) {
// 			alert("Please select atleast one user");
// 			return;
// 		}
// 		if (!groupName.trim) {
// 			alert("Please enter group name");
// 			return;
// 		}

// 		const socket = props.socket
// 		socket.emit("create group", { groupName, selectedUser })

// 		setSelectedUser([])
// 		setGroupName("")
// 		props.onHide();

// 	}

// 	return (
// 		<Modal
// 			{...props}
// 			size="lg"
// 			aria-labelledby="contained-modal-title-vcenter"
// 			centered
// 		>
// 			<Modal.Header closeButton>
// 			</Modal.Header>
// 			<Modal.Body>
// 				<div className="d-flex flex-row mb-3">
// 					<label htmlFor="groupName">Group Name</label>
// 					<input
// 						type="text"
// 						id="groupName"
// 						value={groupName}
// 						onChange={(e) => setGroupName(e.target.value)}
// 					/>
// 					<button onClick={handleOnCreateGroup}>Create Group</button>
// 				</div>
// 				<div>
// 					<div className="d-flex flex-row justify-content-between">
// 						<h4>Add friends:</h4>
// 						<div>
// 							<input
// 								type="search"
// 								value={userName}
// 								onChange={(e) => setUserName(e.target.value)}
// 							/>
// 						</div>

// 					</div>
// 					<hr />
// 					<div style={{ minHeight: "80px" }} className="">
// 						{
// 							selectedUser.length > 0 && (
// 								<div className="d-flex flex-row">
// 									{selectedUser.map((user) => (
// 										<div
// 											key={user._id}
// 											style={{ width: "100px", height: "35px", cursor: "pointer" }}
// 											className="rounded bg-primary text-light d-flex justify-content-center align-items-center"
// 											onClick={() => handleOnDeselect(user)}
// 										>
// 											{user.userName}
// 										</div>
// 									))}
// 								</div>
// 							)
// 						}
// 					</div>
// 					<hr />
// 					<div>
// 						{searchedUser.map((element) => {
// 							return (
// 								<p
// 									key={element._id}
// 									className="bg-primary text-light d-flex justify-content-center align-items-center"
// 									style={{ height: "50px", width: "250px", cursor: "pointer" }}
// 									onClick={() => handleOnSelect(element)}
// 								>
// 									{element.userName}
// 								</p>
// 							);
// 						})}
// 					</div>
// 				</div>
// 			</Modal.Body>
// 			<Modal.Footer>
// 				<Button onClick={props.onHide}>Close</Button>
// 			</Modal.Footer>
// 		</Modal>
// 	);
// }

// function ModalButton({ socket }) {
// 	const [modalShow, setModalShow] = useState(false);

// 	return (
// 		<>
// 			<Button variant="primary" onClick={() => setModalShow(true)}>
// 				Create Group
// 			</Button>

// 			<MyVerticallyCenteredModal
// 				show={modalShow}
// 				onHide={() => setModalShow(false)}
// 				socket={socket}
// 			/>
// 		</>
// 	);
// }

// export default ModalButton;




import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from 'react-icons/fa';
import { Form, InputGroup } from "react-bootstrap"
import { BiUserCircle } from "react-icons/bi";

function MyVerticallyCenteredModal(props) {

	const [searchQuery, setSearchQuery] = useState("")
	const [searchedChats, setSearchedChats] = useState([]);

	// useEffect(() => {
	// 	// const matchedChats = props.chats.filter((chat) => chat.chatName.toLowerCase().includes(se archQuery.toLowerCase()))
	// 	console.log(matchedChats);
	// 	setSearchQuery(matchedChats)
	// }, [searchQuery])


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
				<div className="d-flex flex-row justify-content-between">
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
					<button className="btn btn-success">Create Group</button>
				</div>
				<hr />

				{/* to display selected users for group chat */}
				<div style={{ minHeight: "80px", }} className="d-flex flex-row ">

				</div>
				<hr />
				{/* to display available users */}
				<div className="d-flex flex-column ">
					{
						searchedChats.length > 0 && searchedChats.map(chat => {
							return (
								<div className="d-flex flex-row ps-3 bg-info mb-2 rounded w-50" style={{ cursor: "pointer" }}>
									<BiUserCircle size={45} color="white" />
									<span className="ms-3 fs-5">{chat.chatName} </span>
								</div>
							)
						})
					}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide} className="btn-success">Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ModalButton({ chats }) {
	const [modalShow, setModalShow] = useState(false);

	return (
		<>
			<FaPlus size={20} style={{ cursor: "pointer" }} onClick={() => setModalShow(true)} className="me-3" />

			<MyVerticallyCenteredModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				chats={chats}
			/>
		</>
	);
}

export default ModalButton;
