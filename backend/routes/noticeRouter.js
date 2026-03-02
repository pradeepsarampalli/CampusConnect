import express from "express"
import { getNotices } from "../controllers/noticeController.js"

const noticeRouter = new express.Router()

noticeRouter.get("/", getNotices)

export default noticeRouter

