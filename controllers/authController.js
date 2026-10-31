
const UserAuth=require("../models/auth")


const bcrypt=require("bcrypt")

const jwt=require("jsonwebtoken")

const Broker=require('../models/broker')
const {BrokerAppointment}=require('../models/broker')


const register=async(req,res)=>{

    try{

        const { name,role,email,password}=req.body;

        console.log(password)

        const hashPassword=await bcrypt.hash(password,10);

        console.log(hashPassword)

        const user=await UserAuth.create({
            name,role,email,password:hashPassword
        });

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );


        // Store token in HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });
       


        res.status(200).json({
            message:"user registered successfully",
            user:{
                email:user.email,
                role:user.role,
                id:user._id,
                name:user.name
            },
            token:accessToken
        })

    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }

}

const login=async(req,res)=>{

    try{

        const email=req.body.email;
        const  password=req.body.password;
        
        const user = await UserAuth.findOne({ email });

        console.log("Email received:", email);
        console.log("User found:", !!user);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password correct:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Store token in HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });



            
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
            },
            token:accessToken

        });

    } 
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getMyAppointment=async(req,res)=>{

    try{

        const id=req.user.userId;

        const myAppointment=await BrokerAppointment.find({user:id}).populate("broker" , "name email phone")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            message:"my appointment",
            count: myAppointment.length,
            myAppointment
        })
        
    }
    catch(err){
        console.log(err)
    }


}

module.exports={register,login  , getMyAppointment }