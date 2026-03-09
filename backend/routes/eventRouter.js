import express from "express";
import { adminOnly } from "../middlewares/adminOnly.js";
import { organizerOnly } from "../middlewares/organizerOnly.js";
import { adminOrOrganizer } from "../middlewares/adminOrOrganizer.js";
import { 
  createEvent,
  registerForEvent,
  getEvents,
  getRegistrationCount,
  updateEvent,
  deleteEvent,
  getCreatedEvents,
  editCreatedEvents,
  deleteCreatedEvents
} from "../controllers/eventController.js";
import { authCheck } from "../middlewares/authCheck.js";

const eventRouter = express.Router();

eventRouter.get("/", getEvents);
eventRouter.post("/", adminOrOrganizer, createEvent);
eventRouter.put("/:id", adminOnly, updateEvent);
eventRouter.delete("/:id",adminOnly,deleteEvent);
eventRouter.post("/:id/register", authCheck,registerForEvent);
eventRouter.get("/registrations/count/:userId", getRegistrationCount);
eventRouter.get("/getCreatedEvents",organizerOnly,getCreatedEvents);
eventRouter.put("/:id",organizerOnly,editCreatedEvents);
eventRouter.delete("/:id",organizerOnly,deleteCreatedEvents);

export default eventRouter;