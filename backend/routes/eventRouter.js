import express from "express";
import { adminOnly } from "../middlewares/adminOnly.js";
import {
  createEvent,
  registerForEvent,
  getEvents,
  getRegistrationCount,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.get("/", getEvents);
eventRouter.post("/", adminOnly,createEvent);
eventRouter.put("/:id",adminOnly,updateEvent);
eventRouter.delete("/:id",adminOnly,deleteEvent);
eventRouter.post("/:id/register", registerForEvent);
eventRouter.get("/registrations/count/:userId", getRegistrationCount);
export default eventRouter;