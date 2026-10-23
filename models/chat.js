
const mongoose=require("mongoose")

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth",
        required: true,
      },
    ],

    

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1, property: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports=Chat