const express=require("express")

const { createOrGetChat , getMyChats} = require("../controllers/chatController")
const authMiddleware = require("../middleware/authMiddleware")

const router=express.Router()

router.post('/create-chat' , authMiddleware , createOrGetChat)

router.get('/get-chats'  , authMiddleware , getMyChats)

router.get("/test", (req, res) => {
  res.send("Chat routes working");
});

module.exports=router
