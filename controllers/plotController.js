const Plot=require("../models/plot")

const cloudinary=require('../config/cloudinary')

const {Broker}=require('../models/broker')

const createPlot=async(req,res)=>{

    try {
    const {
        title,
        description,
        plotType,
        area,
        price,
        pricePerSqFt,
        location,
        dimensions,
        facing,
        roadWidth,
        amenities,
        legalStatus,
        ownershipType,
        status
    } = req.body;

    const user = req.user.userId;

    // Parse nested JSON fields
    const parsedArea = JSON.parse(area || "{}");
    const parsedLocation = JSON.parse(location || "{}");
    const parsedDimensions = JSON.parse(dimensions || "{}");
    const parsedAmenities = JSON.parse(amenities || "[]");

    // Upload one image to Cloudinary
    let image = "";

    if (req.file) {
        image = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "real-estate/plots",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            );

            stream.end(req.file.buffer);
        });
    }

    const plot = await Plot.create({
        title,
        description,
        plotType,
        area: parsedArea,
        price: Number(price),
        pricePerSqFt: Number(pricePerSqFt),
        location: parsedLocation,
        dimensions: parsedDimensions,
        facing,
        roadWidth: Number(roadWidth),
        amenities: parsedAmenities,
        legalStatus,
        ownershipType,
        status: status || "available",
        image: image,
        seller: user
    });

    return res.status(201).json({
        success: true,
        message: "Plot created successfully",
        plot
    });
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

const getAllPlots=async(req,res)=>{

    console.log("re re re")

    try{

        console.log("plot req recieved")

        const plots=await Plot.find()


        //console.log(plots)


        res.status(201).json({
            message:"plots rendered",
            plots
        })
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

const getSinglePlot=async(req,res)=>{

    try{

        const id=req.params.id;

        const plot=await Plot.findById(id)

        res.status(201).json({
            message:"plot rendered",
            plot
        })
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

const getPlotBroker = async (req, res) => {
    try {
        const { plotId } = req.params;

        console.log(plotId)

        const plot = await Plot.findById(plotId);

        if(plot){
            console.log('plot ')
        }

        console.log(plot?.seller)

        if (!plot) {
            return res.status(404).json({
                message: "Plot not found"
            });
        }
        if(plot){
            console.log('plot found ')
        }

        const broker = await Broker.findOne({
            user: plot.seller
        });

        if (!broker) {
            console.log("no broker")
            return res.status(404).json({
                message: "Broker profile not found"
            });
        }

        res.status(200).json({
            message: "Broker details fetched successfully",
            broker
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports={createPlot , getAllPlots , getSinglePlot , getPlotBroker}