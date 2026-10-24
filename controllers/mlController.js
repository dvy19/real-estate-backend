const axios=require("axios")
const House=require("../models/house")

const RagChat = require('../models/rag')

const predictHousePrice=async(req,res)=>{
    try{

        const features=req.body;

        const data=await axios.post("http://127.0.0.1:8000/predict-price" , features)

        const predictedPrice =
            data.data.predicted_price;

        const range = 200000;

        const properties = await House.find({
            city: req.body.city,
            price: {
                $gte: predictedPrice - range,
                $lte: predictedPrice + range,
            },
        }).limit(20);

        return res.status(200).json({
            
            predictedPrice,
                priceRange: {
                    min: predictedPrice - range,
                    max: predictedPrice + range,
                },
                count: properties.length,
                properties,
        });
    }

    catch(err){
        console.log(err)
        res.status(500).json({
            err
        })
    }
}

const ragChat=async(req,res)=>{

    try{

        const {question}=req.body;

        const user=req.user.userId 

        const data=await axios.post("http://127.0.0.1:8000/chat" , {question})

        const chat=await RagChat.create({
            user:user,
            question:data.data.question,
            answer:data.data.answer
        })
        res.status(200).json({
            message:"answer rendered",
            data:chat
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            err
        })
    }
}

const getRagChatHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        const history = await RagChat.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Chat history fetched successfully",
            count: history.length,
            data: history
        });

    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: "Failed to fetch chat history",
            error: err.message
        });
    }
};


module.exports={predictHousePrice , ragChat , getRagChatHistory}