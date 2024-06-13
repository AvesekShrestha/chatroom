const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("account creation", (user) => {
    socket.broadcast.emit("new account", user);
  });

  socket.on("setup", (user) => {
    socket.join(user.id);
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });
  socket.on("new message", (newMessageReceived) => {
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
