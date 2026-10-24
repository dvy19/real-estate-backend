
const {Broker , BrokerAvailability , BrokerAppointment}=require("../models/broker")


const cloudinary=require("../config/cloudinary")
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

        const parsedProperties=JSON.parse(propertyTypes)

        let image = null;
        if (req.file) {
            image = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "ngo-app/broker-profiles",
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
            propertyTypes:parsedProperties,
            isVerified,
            rating,
            user,
            image

        })

        res.status(201).json({
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

const brokerAvailability = async (req, res) => {

  try {
    const userId = req.user.userId;

    const broker = await Broker.findOne({ user: userId });

    if (!broker) {
      return res.status(404).json({
        message: "Broker not found"
      });
    }

    const { schedule } = req.body;

    console.log(req.body)

    const availability = await BrokerAvailability.findOneAndUpdate(
      { broker: broker._id },
      { $set: { schedule } },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: "Availability saved successfully",
      availability
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const getBrokerAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id)


        const availability = await BrokerAvailability.findOne({
            broker: id
        });

        console.log(availability)

        if (!availability) {
            return res.status(404).json({
                message: "Broker availability not found"
            });
        }

        res.status(200).json({
            message: "Availability fetched successfully",
            availability
        });

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};


const createAppointment=async(req,res)=>{


    try{

        const user=req.user.userId


        const {appointmentDate , broker , startTime, endTime , status}=req.body

        const appointment=await BrokerAppointment.create({
            user, broker , appointmentDate , startTime, endTime , status
        })

        res.status(200).json({
            message:"appointment created",
            appointment
        })
    }
     catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
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

module.exports={createBroker  , getAllBrokers , getSingleBroker , deleteBroker , brokerAvailability , getBrokerAvailability , createAppointment}