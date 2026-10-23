import axios from "axios";


const predictHousePrice=async(req,res)=>{
    try{

        const features=req.body;

        const data=await axios.post('"http://127.0.0.1:8000/predict-price"' , features)

        res.status(200).json({
            message:"ml model service rendered",
            data
        })
    }

    catch(err){
        console.log(err)
        res.status(500).json({
            err
        })
    }
}

module.exports=predictHousePrice