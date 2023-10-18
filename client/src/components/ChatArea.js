import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client';
const socket = io.connect("http://localhost:8000");


export default function ChatApp() {
  const [room, setRoom] = useState();
  const [message, setMessage] = useState('');
  const [messageRecived, setMessageRecived] = useState('');
  const addMessage = (query) =>{
    const messageContainer = document.getElementById("messageContainer");
    const newMessage = document.createElement("p");

    if(query === "sendMessage"){
      newMessage.className = 'sendMessage';
      newMessage.textContent = message;
    }
    else{
      newMessage.className = "recivedMessage";
      newMessage.textContent = messageRecived;
    }

    messageContainer.appendChild(newMessage);
  }
  const sendMessage = () => {
    socket.emit("send_message", message, room);
    setMessage("");
    addMessage("sendMessage");
  }
  const joinRoom = () => {
    if (room) socket.emit("join_room", (room));
  }

  useEffect(() => {
    socket.on("recive_message", (data) => {
      setMessageRecived(data);
      addMessage("recivedMessage");
    })
  }, [messageRecived]);

  return (
    <>

      <div className=" d-flex justify-content-between flex-column ">
        <div id='messageContainer' style={{ height: "88vh" }}>
          {/* {messageRecived} */}
          

        </div>

        <div className="container-fluid">
          <div className="mb-3 row">
            <div className="col-2"><input className=' form-control' type="text" placeholder='Room:' autoComplete='off'
              onChange={(e) => setRoom(e.target.value)} /></div>
            <div className="col-1"><button className="btn btn-primary" onClick={joinRoom}>Join</button></div>
            <div className="col-8"><input className=' form-control' placeholder='Type message:' type="text"
              autoComplete='off' onChange={(e) => setMessage(e.target.value)} /></div>

            <div className="col-1"><button className="btn btn-primary" onClick={sendMessage}>Send</button></div>
          </div>
        </div>
      </div>

    </>
  )
}
