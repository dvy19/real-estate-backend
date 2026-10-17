const mongoose=require('mongoose')

const houseSchema = new mongoose.Schema({

    title: String,
    description: String,

    listingType: {
        type: String,
        enum: ["Sale", "Rent"],
        required: true
    },

    propertyType: {
        type: String,
        enum: ["Independent House", "Villa", "Duplex", "Row House"],
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    city: String,
    locality: String,
    address: String,
    pincode: String,

    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,
    floors: Number,

    builtUpArea: Number,
    carpetArea: Number,
    plotArea: Number,

    furnishing: {
        type: String,
        enum: ["Furnished", "Semi-Furnished", "Unfurnished"]
    },

    constructionYear: Number,
    facing: String,

    amenities: [String],
    image: String,

    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAuth"
    }
});

const House=mongoose.model("House" , houseSchema)

module.exports=House