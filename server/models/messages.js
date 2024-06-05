const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.ObjectId;

const messageSchema = new mongoose.Schema({
    sender: {
        type: ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    roomId : {
        type : String,
        required : true,
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model("message", messageSchema)
module.exports = Message;
