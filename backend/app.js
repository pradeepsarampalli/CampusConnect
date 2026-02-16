import express from "express"
import dotenv from "dotenv"
import connectDB  from "./config/db.js"
import cors from "cors"
import userRouter from "./routes/userRouter.js"
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
connectDB()

app.use('/api/auth',userRouter)

app.get("/api/test",(req,res)=>{
    res.json({message:"backed is connected!"})
})

app.post("/api/auth/login",(req,res)=>{
    console.log(req.body)
    res.json({message:"Sucess!"})
})

// app.post("/api/auth/register",(req,res)=>{
//     console.log(req.body)
//     res.json({message:"Sucess!"})
// })
export default app;
