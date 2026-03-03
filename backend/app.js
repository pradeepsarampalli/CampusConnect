import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import userRouter from "./routes/userRouter.js"
import noticeRouter from "./routes/noticeRouter.js"
import eventRouter from "./routes/eventRouter.js"
import statRouter from "./routes/statRouter.js"
import User from "./models/User.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
connectDB()

// Routers
app.use("/api/auth", userRouter)
app.use("/api/notices", noticeRouter)
app.use("/api/events", eventRouter)
app.use("/api/admin/getStats",statRouter)

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is connected!" })
})

// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email, password })
        if (!user) return res.status(401).json({ message: "Invalid credentials" })

        res.json({
            message: "Login success",
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed" })
    }
})

// Get profile info
app.get("/api/auth/me", async (req, res) => {
    try {
        const { id } = req.query
        if (!id) return res.status(400).json({ message: "User id is required" })

        const user = await User.findById(id).select("name email role")
        if (!user) return res.status(404).json({ message: "User not found" })

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed" })
    }
})

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
