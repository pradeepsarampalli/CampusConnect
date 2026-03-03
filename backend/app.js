import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import userRouter from "./routes/userRouter.js"
import noticeRouter from "./routes/noticeRouter.js"
import eventRouter from "./routes/eventRouter.js"
import statRouter from "./routes/statRouter.js"
import User from "./models/User.js"
import cookieParser from "cookie-parser"
import { authCheck } from "./middlewares/authCheck.js"
import bcrypt from 'bcrypt'
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({origin: "http://localhost:3000",credentials: true}));
app.use(cookieParser())
connectDB()

// Routers
app.use("/api/auth", userRouter)
app.use("/api/notices", authCheck,noticeRouter)
app.use("/api/events", authCheck,eventRouter)
app.use("/api/admin/getStats",authCheck,statRouter)

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is connected!" })
})

// Get profile info


// Update profile (name & avatarUrl)
app.put("/api/auth/profile", async (req, res) => {
    try {
        const { id, name, avatarUrl } = req.body
        if (!id) return res.status(400).json({ message: "User id is required" })

        const update = {}
        if (typeof name === "string") update.name = name
        if (typeof avatarUrl === "string") update.avatarUrl = avatarUrl

        const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).select("name email role avatarUrl")
        if (!user) return res.status(404).json({ message: "User not found" })

        res.json({
            message: "Profile updated",
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed" })
    }
})

export default app
