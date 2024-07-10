const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const User = require("../models/users");

router.post("/createChat", async (req, res) => {
  try {
    const { isGroupChat, chatName, targetUser } = req.body;
    const currentUser = req.user.id;

    if (
      !targetUser ||
      typeof isGroupChat === "undefined" ||
      (isGroupChat && !chatName)
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let targetUsers = [];

    if (!isGroupChat) {
      const existingChat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [currentUser, targetUser[0]] },
      }).populate({
        path: "users",
        select: "userName _id email",
      });

      if (existingChat) {
        return res.status(200).json(existingChat);
      }

      targetUsers = [targetUser[0]];
    } else {
      const userChats = await Chat.find({ users: currentUser }).populate(
        "users",
        "userName _id email"
      );
      const allUsers = userChats
        .flatMap((chat) => chat.users)
        .filter((user) => user._id.toString() !== currentUser);

      const uniqueUsers = Array.from(
        new Set(allUsers.map((user) => user._id.toString()))
      ).map((id) => allUsers.find((user) => user._id.toString() === id));

      targetUsers = uniqueUsers.map((user) => user._id);
    }

    const newChat = new Chat({
      isGroupChat,
      chatName: isGroupChat
        ? chatName
        : targetUsers.map((user) => user.userName).join(", "),
      groupAdmin: isGroupChat ? currentUser : null,
      users: [currentUser, ...targetUsers],
    });

    const savedChat = await newChat.save();
    const populatedChat = await savedChat.populate({
      path: "users",
      select: "userName _id email",
    });

    res.status(200).json(populatedChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

router.get("/fetchChat/:chatId", async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const selectedChat = await Chat.findById(chatId).populate({
      path: "users",
      select: "userName email _id",
    });
    if (!selectedChat)
      return res.status(400).json({ message: "Invalid chatId" });
    else return res.status(200).json(selectedChat);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Error on fetching specific chat.\n Error : ${error}` });
  }
});

router.get("/fetchAllChats", async (req, res) => {
  try {
    const chats = await Chat.find();
    if (!chats) return res.status(404).json({ message: "No chats found" });
    else return res.status(200).json(chats);
  } catch (error) {
    return res.status(400).json({ message: "Error" });
  }
});

router.put("/addUser/:chatId", async (req, res) => {
  const { userId } = req.body;
  const chatId = req.params.chatId;

  try {
    const selectedChat = await Chat.findById(chatId);
    const userExists = selectedChat.users.some((user) =>
      user._id.equals(userId)
    );

    if (userExists)
      return res.status(400).json({ message: "User already in group" });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate({
        path: "users",
        select: "userName _id email",
      })
      .populate({
        path: "groupAdmin",
        select: "userName _id email",
      });
    if (!updatedChat) return res.status(404).json({ message: "No chat found" });
    else return res.status(200).json(updatedChat);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while updating user in chat" });
  }
});

router.put("/removeUser", async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate({
        path: "users",
        select: "userName _id email",
      })
      .populate({
        path: "groupAdmin",
        select: "userName email _id",
      });
    return res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(400).json({ message: "Error" });
  }
});

router.put("/renameChat", async (req, res) => {
  const { chatId, changedName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: changedName },
      { new: true }
    );

    res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(400).json({ message: "Error" });
  }
});

router.get("/fetchRelatedChats/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const relatedChats = await Chat.find({ users: userId })
      .populate({
        path: "users",
        select: "userName email _id",
      })
      .populate({
        path: "latestMessage",
        select: "sender content",
        populate: {
          path: "sender",
          model: "User",
          select: "userName _id email",
        },
      });

    if (!relatedChats)
      return res.status(404).json({ message: "Related chats not found" });
    else return res.status(200).json(relatedChats);
  } catch (error) {
    return res.status(400).json({ message: "Error" });
  }
});

router.get("/fetchRelatedUsers/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const relatedChats = await Chat.find({ isGroupChat: false, users: userId });
    const allChatUsers = relatedChats.reduce(
      (acc, chat) => [...acc, ...chat.users],
      []
    );

    const relatedUserIds = allChatUsers.filter(
      (user) => user._id.toString() !== req.user.id.toString()
    );

    const relatedUsers = await User.find({
      _id: { $in: relatedUserIds },
    }).select("-password");

    res.status(200).json(relatedUsers);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while fetching related users" });
  }
});

module.exports = router;
