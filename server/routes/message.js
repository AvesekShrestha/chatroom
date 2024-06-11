const express = require("express");
const router = express.Router();

const Message = require("../models/messages");
const Chat = require("../models/chat");

router.get("/fetchMessages/:chatId", async (req, res) => {
  const chatId = req.params.chatId;

  try {
    // const isValidUser = await Chat.findById(chatId).users.some(
    //   (user) => user._id == req.user.id
    // );
    // console.log(isValidUser);

    const messages = await Message.find({ chatId })
      .sort({ sentAt: 1 })
      .populate({
        path: "sender",
        select: "userName email _id",
      });

    if (!messages) return res.status(404).json({ message: "No message found" });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(400).json({ message: "Error while retriving message" });
  }
});

router.post("/sendMessage/:id", async (req, res) => {
  const chatId = req.params.id;
  const { content } = req.body;

  try {
    const newMessage = new Message({ sender: req.user.id, content, chatId });
    await newMessage.save();
    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(400).json({ message: "Failed to save message" });
  }
});

router.delete("/deleteMessage", async (req, res) => {
  try {
    const messageId = req.body;
    console.log(messageId);
    await Message.findByIdAndDelete({ _id: messageId });
    res.status(200).json({ message: "Message Removed" });
  } catch (error) {
    return res.status(400).json({ message: "Erorr" });
  }
});

module.exports = router;
