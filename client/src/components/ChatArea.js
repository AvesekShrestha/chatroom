import React, { useState, useEffect , useRef } from 'react'
import { io } from 'socket.io-client';
const socket = io.connect("http://localhost:8000");


export default function ChatApp() {
  const messageContainer = useRef(null);

  const [room, setRoom] = useState();
  const [message, setMessage] = useState('');

  const scrollToBottom = ()=>{
    messageContainer.current.scroolBottom = messageContainer.current.scroolHeight;
  }

  const sendMessage = () => {
    socket.emit("send_message", message, room);
    setMessage("");
    const newMessage = document.createElement("p");
    newMessage.textContent = message;
    newMessage.style.display = "block";
    newMessage.style.alignSelf = "flex-end";
    newMessage.style.backgroundColor = "rgb(0, 132, 255)";
    newMessage.style.color = "white";
    newMessage.style.borderRadius = "10px 10px 0px 10px";
    newMessage.style.padding = "10px";
    messageContainer.current.appendChild(newMessage);
    scrollToBottom();
  }
  
  const joinRoom = () => {
    if (room) socket.emit("join_room", (room));
  }

  useEffect(() => {
    socket.on("recive_message", (data) => {
      const newMessage = document.createElement("p");
      newMessage.textContent = data;
      newMessage.style.display = "block";
      newMessage.style.alignSelf = "flex-start";
      newMessage.style.borderRadius = "10px 10px 10px 0px";
      newMessage.style.padding = "10px";
      newMessage.style.backgroundColor = "#CCD0D5";

      messageContainer.current.appendChild(newMessage);
      scrollToBottom()
    })
    return()=>{
      socket.off('recive_message');
    }
  }, []);

  return (
    <>

      <div className=" d-flex justify-content-between flex-column" >
        <div className='d-flex justify-content-center' style={{height : "88vh"}} >
          <div className="container d-flex flex-column" ref={messageContainer} style={{height : "100%" , overflowY : "scroll"}}></div>
        </div>

        <div className="container-fluid bg-white">
          <div className="mb-3 row">
            <div className="col-2"><input className=' form-control' type="text" placeholder='Room:' value={room} autoComplete='off'
              onChange={(e) => setRoom(e.target.value)}  /></div>
            <div className="col-1"><button className="btn btn-primary" onClick={joinRoom}>Join</button></div>
            <div className="col-8"><input className=' form-control' placeholder='Type message:' type="text"
              autoComplete='off' value={message} onChange={(e) => setMessage(e.target.value)} /></div>

            <div className="col-1"><button className="btn btn-primary" onClick={sendMessage}>Send</button></div>
          </div>
        </div>
      </div>

    </>
  )
}
