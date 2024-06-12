// const { addGroup } = require("./utils/groups");

// const io = require("socket.io")(5000, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// let users = [];
// let groups = [];

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("addUser", (user) => {
//     socket.join("myRoom");
//     const existingUser = users.find((u) => u.userId === user.id);
//     if (!existingUser) {
//       users.push({ userId: user.id, socketId: socket.id });
//     }
//     io.to("myRoom").emit("getUsers", users);
//   });

//   socket.on("create group", ({ groupName, selectedUser }) => {
//     addGroup(groups, groupName);
//     socket.join(groupName); //user who emmit this even will join this room

//     selectedUser.map((element) => {
//       users.find((u) => u.userId === element._id);
//       socket.join(groupName);
//     });

//     socket.emit("getGroups", groups);
//   });

//   socket.on("send message", (data) => {
//     const receiver = users.find((user) => user.userId === data.to);
//     if (receiver) socket.to(receiver.socketId).emit("message", data.message);
//   });

//   socket.on("disconnect", () => {
//     users = users.filter((user) => user.socketId !== socket.id);
//     console.log("A user disconnected:", socket.id);
//     io.to("myRoom").emit("getUsers", users);
//   });
// });

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("setup", (user) => {
    socket.join(user.id);
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("new message", (newMessageReceived) => {
    // socket
    //   .to(newMessageReceived.chatId._id.toString())
    //   .emit("message received", newMessageReceived);

    const userList = newMessageReceived.chatId.users;
    userList.map((user) => {
      if (user._id === newMessageReceived.sender) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
