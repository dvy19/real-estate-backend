const mongoose=require("mongoose")

const plot=new mongoose.Schema({
    
    title: String,
    description: String,

    plotType: String,
    area: {
        value: Number,
        unit: String
    },

    price: Number,
    pricePerSqFt: Number,

    location: {
        address: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [Number] // [longitude, latitude]
        }
    },

    dimensions: {
        length: Number,
        width: Number,
        unit: String
    },

    facing: String,
    roadWidth: Number,
    amenities: [String],
    images: [String],

    legalStatus: String,
    ownershipType: String,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        default: "available"
    }

})

const Plot=mongoose.model("Plot" , plot)

module.exports=Plot