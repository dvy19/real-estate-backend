const express=require("express")

const routes=express.Router()

const predictHousePrice=require('../controllers/mlController')

routes.post('/predict-house-price' , predictHousePrice)

module.exports=routes