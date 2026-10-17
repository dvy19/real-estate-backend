const mongoose=require('mongoose')

const broker=new mongoose.Schema({

    name:String,
    phone:String,
    city:String,
    office:String,
    image:String,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserAuth"
    },

    propertyTypes:[String],

    isVerified:String,
    rating:Number
})

const Broker=mongoose.model("Broker" , broker)

module.exports=Broker