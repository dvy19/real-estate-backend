const express=require("express")

const router=express.Router()

const {createBroker , getAllBrokers , getSingleBroker } = require("../controllers/brokerController")

const upload=require('../middleware/upload')
const authMiddleware=require('../middleware/authMiddleware')


router.post("/create-broker" , upload.single("image") , authMiddleware ,  createBroker)

router.get("/get-all-brokers" , getAllBrokers)
router.get('/get-single-broker/:id' , getSingleBroker)

module.exports=router