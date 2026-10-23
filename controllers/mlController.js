import axios from "axios";

const House=require("../models/house")

const predictHousePrice=async(req,res)=>{
    try{

        const features=req.body;

        const data=await axios.post('"http://127.0.0.1:8000/predict-price"' , features)

        const predictedPrice =
      predictionResponse.data.predicted_price;

        const range = 200000;

        const properties = await House.find({
            city: req.body.features.city,
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

module.exports=predictHousePrice