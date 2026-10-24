const express=require("express")

const routes=express.Router()

const {predictHousePrice , ragChat , getRagChatHistory}=require('../controllers/mlController')

const authMiddleware=require('../middleware/authMiddleware')

routes.post('/predict-house-price' , predictHousePrice)

routes.post('/rag-chat' , authMiddleware, ragChat )

routes.get('/rag-history' , authMiddleware , getRagChatHistory )
module.exports=routes