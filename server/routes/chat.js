const express = require("express")
const router = express.Router()

const Message = require("../models/messages")

router.get("/reteriveMessage/:id", async (req, res) => {
    const roomId = req.params.id;

    try {
        const messages = await Message.find({ roomId }).sort({ sentAt: 1 })
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(400).json({ message: "Error while retriving message" })
    }
})

router.post("/sendMessage/:id", async (req, res) => {
    const roomId = req.params.id;
    const { content, sender } = req.body;

    try {
        const newMessage = new Message({ sender, content, roomId })
        await newMessage.save()
        return res.status(200).json(newMessage)
    } catch (error) {
        return res.status(400).json({ message: "Failed to save message" })
    }
})


module.exports = router;
