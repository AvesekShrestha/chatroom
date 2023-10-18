const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require ('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server , {
  cors: {
    origin : "http://localhost:3000",
    methods: ["GET" , "POST"]
  }
})


io.on("connection" , (socket)=>{
  console.log(`New user connected ${socket.id}`);

  socket.on("join_room" , (data)=>{
    socket.join(data);
  })

  socket.on("send_message" , (data , room)=>{
    socket.to(room).emit("recive_message" , data);
  })
})


server.listen(8000);



