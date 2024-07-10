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

  socket.on("create group", (data) => {
    const userList = data.users;

    userList.map((user) => {
      if (user._id === data.groupAdmin) return;
      socket.to(user._id).emit("group created", data);
    });
  });

  socket.on("chat request", (data) => {
    const { chat, currentUser } = data;
    const userList = chat.users;

    userList.map((user) => {
      if (user._id === currentUser.id) return;
      socket.to(user._id).emit("chat request response", chat);
    });
  });

  socket.on("new message", (newMessageReceived) => {
    const userList = newMessageReceived.chatId.users;
    userList.map((user) => {
      if (user._id === newMessageReceived.sender) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("call user", (data) => {
    const { chat, currentUser, offer } = data;
    const userList = chat.users;
    userList.map((user) => {
      if (user._id === currentUser.id) return;
      socket
        .in(user._id)
        .emit("incomming call", { chat, from: currentUser, offer });
    });
  });

  socket.on("call accepted", (data) => {
    const { chat, currentUser, answer } = data;
    const userList = chat.users;

    userList.map((user) => {
      if (user._id === currentUser.id) return;
      socket.in(user._id).emit("call accepted", { answer });
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
