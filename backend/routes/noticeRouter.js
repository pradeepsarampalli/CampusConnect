import express from "express";
import {
  getNotice,
  createNotice,
  deleteNotice,
  updateNotice,
} from "../controllers/noticeController.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const noticeRouter = new express.Router();
noticeRouter.get("/", getNotice);
noticeRouter.post("/", adminOnly, createNotice);
noticeRouter.delete("/:id", adminOnly, deleteNotice);
noticeRouter.put("/:id", adminOnly, updateNotice);

export default noticeRouter;
