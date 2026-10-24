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


const brokerAvailabilitySchema = new mongoose.Schema({

  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Broker",
    required: true,
    unique: true
  },

  schedule: [
    {
        date:String,

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


const appointment=new mongoose.Schema({

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },

    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },

  },

  { timestamps: true }
);


const Broker=mongoose.model("Broker" , broker)

const BrokerAppointment=mongoose.model("BrokerAppointment" , appointment)

module.exports={Broker , BrokerAvailability ,  BrokerAppointment}