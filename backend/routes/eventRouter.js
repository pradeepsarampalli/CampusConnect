import express from "express"
import { adminOnly }        from "../middlewares/adminOnly.js"
import { authCheck }        from "../middlewares/authCheck.js"
import { organizerOrAdmin } from "../middlewares/organizerOrAdmin.js"
import {
    createEvent, getEvents, getMyEvents, updateEvent, deleteEvent,
    registerForEvent, getMyQR, getMyRegisteredEvents, getRegistrationCount,
    getEventRegistrations,
    applyAsVolunteer, getMyVolunteerApplications, getVolunteerOpportunities,
    getEventVolunteerApplications, updateVolunteerStatus,
} from "../controllers/eventController.js"

const eventRouter = express.Router()

eventRouter.get("/", getEvents)
eventRouter.post("/", organizerOrAdmin, createEvent)

eventRouter.get("/my/registrations",authCheck, getMyRegisteredEvents)
eventRouter.get("/my/volunteer-applications",authCheck, getMyVolunteerApplications)
eventRouter.get("/volunteer/opportunities",authCheck, getVolunteerOpportunities)


eventRouter.get("/my/events", organizerOrAdmin, getMyEvents)
eventRouter.put( "/:id",organizerOrAdmin, updateEvent)
eventRouter.delete("/:id",organizerOrAdmin, deleteEvent)

eventRouter.get("/:eventId/registrations",organizerOrAdmin, getEventRegistrations)
eventRouter.get("/:eventId/volunteer-applications",organizerOrAdmin, getEventVolunteerApplications)
eventRouter.patch("/:eventId/volunteer/:applicationId/status",organizerOrAdmin, updateVolunteerStatus)


eventRouter.post("/:id/register",authCheck, registerForEvent)
eventRouter.get( "/:id/my-qr",authCheck, getMyQR)
eventRouter.post("/:id/volunteer",authCheck, applyAsVolunteer)

eventRouter.get("/registrations/count/:userId", adminOnly, getRegistrationCount)

export default eventRouter
