const mongoose = require("mongoose");

const ragChatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserAuth",
            required: true
        },
        question: {
            type: String,
            required: true,
            trim: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("RagChat", ragChatSchema);