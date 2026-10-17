const express=require("express")

const router=express.Router()
const upload=require('../middleware/upload')
const authMiddleware=require('../middleware/authMiddleware')

const { createHouse , getAllHouses, getSingleHouse}=require("../controllers/houseController")
const { route } = require("./brokerRoutes")

router.post('/create-house' , authMiddleware, upload.single("image")  , createHouse)

route.get('/get-all-houses'  , getAllHouses)

router.get('/get-single-house/:id', getSingleHouse )

module.exports=router