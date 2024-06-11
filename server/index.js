const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

require("./database/connect");

const authRouter = require("./routes/auth");
const messageRouter = require("./routes/message");
const chatRouter = require("./routes/chat");

const checkValidation = require("./middleware/requireAuth");

app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api/v1/", authRouter);
app.use("/api/v1/", checkValidation, messageRouter);
app.use("/api/v1/", checkValidation, chatRouter);

app.listen(8000);
