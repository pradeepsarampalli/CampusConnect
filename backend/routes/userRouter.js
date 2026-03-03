import express from "express";
import {signUp,signIn, getUsers, signOut,getMe} from "../controllers/userController.js";
import { authCheck } from "../middlewares/authCheck.js";
const userRouter = new express.Router()
userRouter.get("/getUsers",getUsers)
userRouter.post("/signup",signUp)
userRouter.post("/signin",signIn)
userRouter.get("/signOut",signOut)
userRouter.get("/me", authCheck, getMe);
export default userRouter