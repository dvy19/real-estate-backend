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

const mongoose = require("mongoose");

const brokerAvailabilitySchema = new mongoose.Schema({

  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAuth",
    required: true,
    unique: true
  },

  schedule: [
    {
      day: {
        type: String,
        enum: [
          "Monday", "Tuesday", "Wednesday",
          "Thursday", "Friday", "Saturday", "Sunday"
        ],
        required: true
      },

      isAvailable: {
        type: Boolean,
        default: true
      },

      startTime: {
        type: String,
        default: "10:00"
      },

      endTime: {
        type: String,
        default: "12:00"
      }
    }
  ]
}, { timestamps: true });

const BrokerAvailability = mongoose.model(
  "BrokerAvailability",
  brokerAvailabilitySchema
);

const Broker=mongoose.model("Broker" , broker)

module.exports={Broker , BrokerAvailability}