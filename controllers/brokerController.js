
const {Broker , BrokerAvailability , BrokerAppointment}=require("../models/broker")

const House=require('../models/house')
const Plot=require('../models/plot')

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

const getAllBrokers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        const skip = (page - 1) * limit;

        const brokers = await Broker.find()
            .skip(skip)
            .limit(limit);

        const totalBrokers = await Broker.countDocuments();

        res.status(200).json({
            message: "Brokers fetched successfully",
            brokers,
            pagination: {
                totalBrokers,
                currentPage: page,
                totalPages: Math.ceil(totalBrokers / limit),
                limit
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching brokers",
            error: error.message
        });
    }
};

const getMyProfile=async(req,res)=>{

    try{

        const id=req.user.userId

        const broker=await Broker.findOne({user:id})

        res.status(200).json({
            message:"profile rendered",
            broker
        })
    }
    catch(err){
        console.log(err)

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

        const io = req.app.get("io");

        io.to(`broker_${broker}`).emit("new_appointment", {
            message: "You have a new appointment request",
            appointment,
        });

        console.log("message sent")

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
const getBrokerAppointment = async (req, res) => {
    try {
        const id = req.user.userId;

        const broker = await Broker.findOne({ user: id });

        if (!broker) {
        return res.status(404).json({
            message: "Broker profile not found",
        });
        }

        const appointments = await BrokerAppointment.find({
                        broker: broker._id,
                    })
                    .populate("user", "name email")
                    .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All appointments fetched successfully",
            appointments,
        });

    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
        message: error.message,
        });
    }
};


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

const getBrokerProperties = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)

        // 1. Find broker profile and get its auth ID
        const broker = await Broker.findById(id);

        if (!broker) {
            return res.status(404).json({
                message: "Broker not found"
            });
        }

        const authId = broker.user;

        /*
        it is a JavaScript technique used to run multiple asynchronous database operations concurrently.
        Promise.all() waits for both operations to finish. They can execute while the other query is still running, rather than waiting for the first query to finish before starting the second.

        [houses, plots]?
            This is called array destructuring in JavaScript.

            Promise.all() returns an array of results in the same order as the input promises.

        const results=await Promise.all([
        House.find(),
        Plot.find()])

        const House=results[0]

        If you want each query to succeed or fail independently, you can use Promise.allSettled() instea
        */

        // 2. Fetch houses and plots in parallel
        const [houses, plots] = await Promise.all([
            House.find({ broker: authId }),
            Plot.find({ seller: authId })
        ]);

        // 3. Return both in a single response
        res.status(200).json({
            message: "Broker properties fetched successfully",
            broker,
            houses,
            plots,
            totalProperties: houses.length + plots.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching broker properties",
            error: error.message
        });
    }
};






module.exports={createBroker  , 
    getAllBrokers ,
    getSingleBroker , 
    deleteBroker ,
    brokerAvailability , 
    getBrokerAvailability ,
    createAppointment ,
    getMyProfile,
    getBrokerAppointment,
    getBrokerProperties
}