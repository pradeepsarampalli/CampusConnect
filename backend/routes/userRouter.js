import express from "express";
import signUp from "../controllers/userController.js";
const userRouter = new express.Router()
userRouter.post("/signup",signUp)
export default userRouter