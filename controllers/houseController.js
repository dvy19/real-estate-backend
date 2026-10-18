
const House=require('../models/house')

const createHouse=async(req,res)=>{

    try{

        const user=req.user.userId

        const{
            title,
            description,
            listingType,
            propertyType,
            price,
            city,
            locality,
            address,
            pincode,

            bedrooms,
            bathrooms,
            balconies,
            facing,
            floors,

             builtUpArea,
             carpetArea,
             plotArea,
             furnishing,

        } = req.body;

        const paersedAmeneties=JSON.parse(amenities)

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


        const house=await House.create({
            broker:user,
            image,

            title,
            description,
            listingType,
            propertyType,
            price,
            city,
            locality,
            address,
            pincode,

            bedrooms,
            bathrooms,
            balconies,
            facing,
            floors,

            builtUpArea,
            carpetArea,
            plotArea,
            furnishing,
            amenities:paersedAmeneties

        })

        res.status(200).json({
            message:"house creted",
            house
        })
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

const getAllHouses=async(req,res)=>{

    try{

        const houses=await House.find()

        res.status(201).json({
            message:"houses rendered",
            houses
        })
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}


const getSingleHouse=async(req,res)=>{

    try{

        const id=req.params.id;

        const house=await House.findById(id)

        res.status(201).json({
            message:"house rendered",
            house
        })
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

module.exports={createHouse, getAllHouses, getSingleHouse}