
const mongoose=require("mongoose")

const Chat=require('../models/chat')

const UserAuth=require('../models/auth')

const {Broker}=require('../models/broker')

const Message=require('../models/message')


// Create a new chat or return an existing one
const createOrGetChat = async (req, res, next) => {

  console.log("create chat")
  
  try {
    const userId = req.user.userId;
    const { brokerId } = req.body;

    console.log(req.body)

    console.log(brokerId)

    // Validate broker ID
    if (!brokerId || !mongoose.isValidObjectId(brokerId)) {
      return res.status(400).json({
        message: "Valid broker ID is required",
      });
    }

    

    const brokerProfile = await Broker.findById(brokerId);


    if (!brokerProfile) {
      return res.status(404).json({
        message: "Broker profile not found",
      });
    }

    const brokerUserId = brokerProfile.user;

    // Prevent chatting with yourself
    if (userId.toString() === brokerUserId.toString()) {
      return res.status(400).json({
        message: "You cannot create a chat with yourself",
      });
    }

    // Verify that the broker exists
    const broker = await UserAuth.findOne({
      _id: brokerUserId,
      role: "broker",
    });

    if(broker){
      console.log("broker found")
    }

    if (!broker) {
      return res.status(404).json({
        message: "Broker not found",
      });
    }

    // Find an existing conversation between these two users
    const existingChat = await Chat.findOne({
      participants: {
        $all: [userId, brokerUserId],
        $size: 2,
      },
    }).populate(
      "participants",
      "name role image"
    );

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists",
        chat: existingChat,
      });
    }

    // Create a new conversation
    const newChat = await Chat.create({
      participants: [userId, brokerUserId],
    });

    const populatedChat = await Chat.findById(newChat._id)
      .populate("participants", "name role image");

    return res.status(201).json({
      message: "Chat created successfully",
      chat: populatedChat,
    });
  } catch (error) {
    next(error);
  }
};


// Get all conversations of the logged-in user
const getMyChats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name role profileImage")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      count: chats.length,
      chats,
    });
  } catch (error) {
    next(error);
  }
};

const sendMessage=async(req,res)=>{

  try{

    const user=req.user.userId
    const { chatId, text}=req.body

    const io = req.app.get("io");


    const chat = await Chat.findOne({
      _id: chatId,
      participants: user,
    });

    const message = await Message.create({
      chat: chatId,
      sender: user,
      text: text.trim(),
      readBy: [user],
    });

    chat.lastMessage = message._id;
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name role image");

    io.to(chatId).emit("new_message", populatedMessage);

    return res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } 
  catch (error) {
    next(error);
  }
}

module.exports={createOrGetChat , getMyChats , sendMessage}