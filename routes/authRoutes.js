const express=require("express")

const router=express.Router()

const {register,login , getMyAppointment}=require('../controllers/authController')

const authMiddleware=require("../middleware/authMiddleware")

router.post('/register' , register)

router.post('/login' , login)

router.get('/get-my-appointments' , authMiddleware , getMyAppointment)

module.exports=router

