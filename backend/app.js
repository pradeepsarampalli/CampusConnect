    import express from "express"
    import dotenv from "dotenv"
    import connectDB  from "./config/db.js"
    import cors from "cors"
    import userRouter from "./routes/userRouter.js"
    import eventController from "./controllers/eventController.js"
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

    app.get("/",(req,res)=>{
        res.json({message:"success"})
    })

    app.post("/api/event/registerEvent",eventController.registerEvent)
    
    app.delete("/api/event/deleteEvent",eventController.deleteEvent)

    app.put("/api/event/editEvent/:id",eventController.editEvent)

    // app.post("/api/auth/register",(req,res)=>{
    //     console.log(req.body)
    //     res.json({message:"Sucess!"})
    // })
    export default app;
