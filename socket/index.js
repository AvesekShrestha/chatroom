const io = require("socket.io")(5000, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let users = [];

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("addUser", (user) => {
        socket.join("myRoom");
        const existingUser = users.find(u => u.userId === user.id);
        if (!existingUser) {
            users.push({ userId: user.id, socketId: socket.id });
        }
        io.to("myRoom").emit("getUsers", users);
    });

    socket.on("send message", (data) => {
        const receiver = users.find((user) => user.userId === data.to)
        if (receiver)
            socket.to(receiver.socketId).emit("message", data.message);
    });

    socket.on("disconnect", () => {
        users = users.filter(user => user.socketId !== socket.id);
        console.log("A user disconnected:", socket.id);
        io.to("myRoom").emit("getUsers", users);
    });
});
