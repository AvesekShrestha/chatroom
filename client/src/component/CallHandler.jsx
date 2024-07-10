import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaPhone } from 'react-icons/fa';
import { useSocket } from '../context/socket';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { usePeer } from '../context/webrtc';

function OffCanvasExample({ name, caller, offer, chat, ...props }) {
    const [show, setShow] = useState(true);
    const socket = useSocket();
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const { receiveCall } = usePeer();

    const handleClose = () => setShow(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = jwtDecode(token);
        setCurrentUser(user);
    }, []);

    const handleOnAnswer = async () => {
        const { answer } = await receiveCall(offer);
        socket.emit("call accepted", { chat, currentUser, answer });
        setShow(false);
        navigate("/call");
    };

    const handleOnReject = () => {
        console.log("Call Rejected");
        setShow(false);
    };

    return (
        <>
            <Offcanvas show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className='fs-3'>Incoming Call...</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='d-flex flex-column '>
                        <p className='fs-1 d-block m-auto'>{caller.userName}</p>
                        <div className='d-flex flex-row justify-content-around align-items-center mt-5'>
                            <FaPhone cursor={"pointer"} size={30} color='red' onClick={handleOnReject} />
                            <FaPhone cursor={"pointer"} size={30} color='green' onClick={handleOnAnswer} />
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

function CallHandler({ caller, offer, chat }) {
    return (
        <>
            <OffCanvasExample placement={"top"} name={"top"} caller={caller} offer={offer} chat={chat} />
        </>
    );
}

export default CallHandler;
