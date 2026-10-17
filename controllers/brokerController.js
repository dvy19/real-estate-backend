
const Broker=require("../models/broker")

const createBroker=async(req,res)=>{

    try{

        const user=req.user.userId;

        const{
            name,
            city,
            phone,
            office,
            propertyTypes,
            isVerified,
            rating
        }=req.body;

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


        const broker=await Broker.create({

            name,
            city,
            phone,
            office,
            propertyTypes,
            isVerified,
            rating,
            user,
            image

        })

        res.stats(201).json({
            message:"broker profile created",
            broker
        })


    }


    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}


const getAllBrokers=async(req,res)=>{

    try{

        const brokers=await Broker.find()

        res.status(200).json({
            message:"all brokers",
            brokers
        })


    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

const getSingleBroker=async(req,res)=>{

    try{

        const id=req.params.id;
        const broker=await Broker.findById(id)

        res.status(200).json({
            message:"broker rendered",
            broker
        })


    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

const deleteBroker=async(req,res)=>{

    try{

        const id=req.user.userId;

        const broker=await Broker.findOneAndDelete({user:id})
        res.status(200).json({
            message:"broker profile deleted"
        })
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            err
        })
    }
}

module.exports={createBroker  , getAllBrokers , getSingleBroker , deleteBroker}