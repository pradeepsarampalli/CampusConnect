import express from "express";
const eventRouter = express.Router();

import {
  createEvent,
  registerForEvent,
  getEvents,
  getRegistrationCount
} from "../controllers/eventController.js";

// Get all events
eventRouter.get("/", getEvents);

// Create event
eventRouter.post("/", createEvent);

// Register for event
eventRouter.post("/:id/register", registerForEvent);

// Get registration count
eventRouter.get("/registrations/count/:userId", getRegistrationCount);

export default eventRouter;