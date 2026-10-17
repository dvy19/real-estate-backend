const Plot=require("../models/plot")

const createPlot=async(req,res)=>{

    try{

        const {
            title,
            description,
            plotType,
            area,
            price,
            location,
            dimensions,
            facing,
            roadWidth,
            amenities,
            images,
            legalStatus,
            ownershipType,
        } = req.body;

        const user=req.user.userId

        let image = null;
        if (req.file) {
            image = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "ngo-app/user-profiles",
                        resource_type: "image"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }

                    }
                );

                stream.end(req.file.buffer);
            });
        }


        const plot=await Plot.create({
            title,
            description,
            plotType,
            area,
            price,
            location,
            dimensions,
            facing,
            roadWidth,
            amenities,
            images,
            legalStatus,
            ownershipType,
            image,
            user

        })


        res.status(200).json({
            message:"plot created",
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

const getAllPlots=async(req,res)=>{

    try{

        const plots=await Plot.find()


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