const express=require("express")

const router=express.Router()

const {createPlot , getAllPlots , getSinglePlot , getPlotBroker}=require("../controllers/plotController")

const authMiddleware=require("../middleware/authMiddleware")

const upload=require("../middleware/upload")

router.post("/create-plot" , upload.single("image")  , authMiddleware , createPlot)
router.get("/get-all-plots" , getAllPlots)
router.get('/get-single-plot/:id' , getSinglePlot)

router.get('/plot-broker/:plotId' , getPlotBroker)



module.exports=router