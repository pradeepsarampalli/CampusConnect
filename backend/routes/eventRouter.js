import express from "express";
const eventRouter = express.Router();

import {
  createEvent,
  registerForEvent,
  getEvents,
  getRegistrationCount,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

eventRouter.get("/", getEvents);
eventRouter.post("/", createEvent);
eventRouter.put("/:id",updateEvent);
eventRouter.delete("/:id",deleteEvent);

eventRouter.post("/:id/register", registerForEvent);

// Get registration count
eventRouter.get("/registrations/count/:userId", getRegistrationCount);

export default eventRouter;