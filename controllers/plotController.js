const Plot=require("../models/plot")

const cloudinary=require('../config/cloudinary')

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

module.exports={createPlot , getAllPlots , getSinglePlot}