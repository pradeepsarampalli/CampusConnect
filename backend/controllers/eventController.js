import QRCode from "qrcode"
import Event from "../models/Event.js"
import EventRegistration from "../models/EventRegistration.js"
import VolunteerApplication from "../models/VolunteerApplication.js"

function canManageEvent(user, event) {
    if (user.role === 'admin') return true
    if (user.role === 'organizer' && String(event.createdBy) === String(user.id)) return true
    return false
}


export async function createEvent(req, res) {
    try {
        const { title, description, date, location, capacity, maxVolunteers } = req.body
        if (!title || !date || !location || !capacity) {
            return res.status(400).json({ message: "Required fields missing" })
        }
        const event = await Event.create({
            title, description, date, location,
            capacity:Number(capacity),
            seatsRemaining:Number(capacity),
            maxVolunteers:Number(maxVolunteers) || 0,
            volunteersRemaining: Number(maxVolunteers) || 0,
            createdBy:req.user.id
        })
        res.status(201).json({ message: "Event created successfully", event })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to create event" })
    }
}

export async function getEvents(req, res) {
    try {
        const events = await Event.find().populate("createdBy", "name email")
        res.json(events)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch events" })
    }
}

export async function getMyEvents(req, res) {
    try {
        const filter = req.user.role === 'admin' ? {} : { createdBy: req.user.id }
        const events = await Event.find(filter).sort({ createdAt: -1 })
        res.json(events)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch events" })
    }
}

export async function updateEvent(req, res) {
    const id = req.params.id
    try {
        const event = await Event.findById(id)
        if (!event) return res.status(404).json({ message: "Event not found!" })
        if (!canManageEvent(req.user, event)) {
            return res.status(403).json({ message: "You can only edit your own events" })
        }
        const updated = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        res.status(200).json({ event: updated })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to update event" })
    }
}

export async function deleteEvent(req, res) {
    const id = req.params.id
    try {
        const event = await Event.findById(id)
        if (!event) return res.status(404).json({ message: "Event not found!" })
        if (!canManageEvent(req.user, event)) {
            return res.status(403).json({ message: "You can only delete your own events" })
        }
        await Event.findByIdAndDelete(id)
        await EventRegistration.deleteMany({ eventId: id })
        await VolunteerApplication.deleteMany({ eventId: id })
        res.status(200).json({ message: "Event deleted!" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}


export async function registerForEvent(req, res) {
    try {
        const { id } = req.params
        const userId  = req.user.id

        const event = await Event.findById(id)
        if (!event) return res.status(404).json({ message: "Event not found" })
        if (event.seatsRemaining <= 0) return res.status(400).json({ message: "No seats remaining" })

        const existing = await EventRegistration.findOne({ userId, eventId: id })
        if (existing) return res.status(400).json({ message: "Already registered", qrCode: existing.qrCode })

        const qrPayload = JSON.stringify({
            type: "attendee", userId: String(userId),
            eventId: String(event._id), event: event.title,
            date: event.date.toISOString(), location: event.location
        })
        const qrCode = await QRCode.toDataURL(qrPayload, {
            width: 300, margin: 2, color: { dark: "#1a1a2e", light: "#ffffff" }
        })

        const registration = await EventRegistration.create({ userId, eventId: id, qrCode })
        event.seatsRemaining -= 1
        await event.save()

        res.status(201).json({ message: "Registered successfully", qrCode, registrationId: registration._id })
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "Already registered" })
        console.error(err)
        res.status(500).json({ message: "Failed to register" })
    }
}

export async function getMyQR(req, res) {
    try {
        const { id } = req.params
        const userId  = req.user.id
        const reg = await EventRegistration.findOne({ userId, eventId: id })
        if (!reg) return res.status(404).json({ message: "Not registered for this event" })
        res.json({ qrCode: reg.qrCode, registrationId: reg._id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch QR code" })
    }
}


export async function getMyRegisteredEvents(req, res) {
    try {
        const userId = req.user.id
        const registrations = await EventRegistration
            .find({ userId })
            .populate("eventId", "title date location")
        res.json({ registrations })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch registrations" })
    }
}

export async function getEventRegistrations(req, res) {
    try {
        const { eventId } = req.params
        const event = await Event.findById(eventId)
        if (!event) return res.status(404).json({ message: "Event not found" })
        if (!canManageEvent(req.user, event)) {
            return res.status(403).json({ message: "Access denied" })
        }
        const registrations = await EventRegistration
            .find({ eventId })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
        res.json({ registrations })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch registrations" })
    }
}

export async function getRegistrationCount(req, res) {
    try {
        const { userId } = req.params
        if (!userId) return res.status(400).json({ message: "User ID is required" })
        const count = await EventRegistration.countDocuments({ userId })
        res.json({ count })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch registration count" })
    }
}


export async function applyAsVolunteer(req, res) {
    try {
        const { id } = req.params
        const userId  = req.user.id

        const event = await Event.findById(id)
        if (!event)                           return res.status(404).json({ message: "Event not found" })
        if (event.maxVolunteers === 0)         return res.status(400).json({ message: "This event does not accept volunteers" })
        if (event.volunteersRemaining <= 0)   return res.status(400).json({ message: "No volunteer slots remaining" })

        const existing = await VolunteerApplication.findOne({ userId, eventId: id })
        if (existing) return res.status(400).json({ message: "Already applied", qrCode: existing.qrCode, status: existing.status })

        const qrPayload = JSON.stringify({
            type: "volunteer", userId: String(userId),
            eventId: String(event._id), event: event.title,
            date: event.date.toISOString(), location: event.location
        })
        const qrCode = await QRCode.toDataURL(qrPayload, {
            width: 300, margin: 2, color: { dark: "#0d4f4f", light: "#ffffff" }
        })

        const application = await VolunteerApplication.create({ userId, eventId: id, qrCode })
        event.volunteersRemaining -= 1
        await event.save()

        res.status(201).json({
            message: "Volunteer application submitted!",
            qrCode, status: application.status, applicationId: application._id
        })
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "Already applied" })
        console.error(err)
        res.status(500).json({ message: "Failed to apply as volunteer" })
    }
}

export async function getMyVolunteerApplications(req, res) {
    try {
        const userId = req.user.id
        const applications = await VolunteerApplication
            .find({ userId })
            .populate("eventId", "title date location maxVolunteers volunteersRemaining")
            .sort({ createdAt: -1 })
        res.json({ applications })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch volunteer applications" })
    }
}

export async function getVolunteerOpportunities(req, res) {
    try {
        const events = await Event.find({ maxVolunteers: { $gt: 0 }, volunteersRemaining: { $gt: 0 } })
        res.json(events)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch opportunities" })
    }
}

export async function getEventVolunteerApplications(req, res) {
    try {
        const { eventId } = req.params
        const event = await Event.findById(eventId)
        if (!event) return res.status(404).json({ message: "Event not found" })
        if (!canManageEvent(req.user, event)) {
            return res.status(403).json({ message: "Access denied" })
        }
        const applications = await VolunteerApplication
            .find({ eventId })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
        res.json({ applications })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch applications" })
    }
}

export async function updateVolunteerStatus(req, res) {
    try {
        const { eventId, applicationId } = req.params
        const { status } = req.body

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" })
        }

        const event = await Event.findById(eventId)
        if (!event) return res.status(404).json({ message: "Event not found" })
        if (!canManageEvent(req.user, event)) {
            return res.status(403).json({ message: "Access denied" })
        }

        const application = await VolunteerApplication.findOne({ _id: applicationId, eventId })
        if (!application) return res.status(404).json({ message: "Application not found" })

        const prev = application.status
        if (status === "rejected" && prev === "pending") {
            await Event.findByIdAndUpdate(eventId, { $inc: { volunteersRemaining: 1 } })
        }
        if (status === "approved" && prev === "rejected") {
            const freshEvent = await Event.findById(eventId)
            if (freshEvent.volunteersRemaining <= 0) {
                return res.status(400).json({ message: "No volunteer slots remaining" })
            }
            await Event.findByIdAndUpdate(eventId, { $inc: { volunteersRemaining: -1 } })
        }

        application.status = status
        await application.save()
        res.json({ message: `Application ${status}`, application })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to update application status" })
    }
}
