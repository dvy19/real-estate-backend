const express=require("express")
const cors=require("cors")

const connectDB=require("./config/db")

require("dotenv").config()
const app=express()

app.use(express.json())

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173"
    ],
    credentials: true
}));

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

const http=require("http")


const cookieParser=require("cookie-parser")
app.use(cookieParser())


const authRoutes=require("./routes/authRoutes")
const plotRoutes=require("./routes/plotRoutes")
const brokerRoutes=require('./routes/brokerRoutes')

const houseRoutes=require('./routes/houseRoutes')

const server=http.createServer(app)



app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use('/user' , authRoutes)
app.use('/plot' , plotRoutes )
app.use('/broker' , brokerRoutes)
app.use('/house',  houseRoutes)



app.get("/", (req, res) => {
    res.send("Server is running");
});



// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});



const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    //await connectRedis();

    function startIt(){
        console.log(`Server running on port ${PORT}`);
    }

    // after success, the 2nd argument function will run
    server.listen(PORT, startIt);
};

startServer()
