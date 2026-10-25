const express=require("express")

const router=express.Router()

const {createBroker , 
    getAllBrokers , 
    getSingleBroker  , 
    deleteBroker , 
    brokerAvailability  , 
    getBrokerAvailability , 
    createAppointment,
    getMyProfile,
    getBrokerAppointment
} = require("../controllers/brokerController")

const upload=require('../middleware/upload')
const authMiddleware=require('../middleware/authMiddleware')


router.post("/create-broker" , upload.single("image") , authMiddleware ,  createBroker)

router.get("/get-all-brokers" , getAllBrokers)
router.get('/get-single-broker/:id' , getSingleBroker)

router.post('/broker-availability' , authMiddleware , brokerAvailability)
router.get('/get-broker-schedule/:id'  , getBrokerAvailability)
router.delete('/delete-broker' , authMiddleware , deleteBroker)

router.post('/create-appointment' ,  authMiddleware , createAppointment)

router.get('/get-my-broker-profile' , authMiddleware , getMyProfile )

router.get('/get-self-broker-appointment' , authMiddleware , getBrokerAppointment)

module.exports=router