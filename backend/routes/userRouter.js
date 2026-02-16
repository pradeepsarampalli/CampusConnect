import express from "express";
import register from "../controllers/userController.js";
const userRouter = new express.Router()
userRouter.post("/register",register)
export default userRouter