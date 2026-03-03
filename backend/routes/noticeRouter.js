import express from "express"
import { getNotice,createNotice,deleteNotice, updateNotice} from "../controllers/noticeController.js"

const noticeRouter = new express.Router()
noticeRouter.get("/", getNotice)
noticeRouter.post("/",createNotice)
noticeRouter.delete("/:id", deleteNotice);
noticeRouter.put("/:id", updateNotice);

export default noticeRouter

