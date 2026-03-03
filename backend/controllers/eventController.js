import Event from "../models/Event.js"
import EventRegistration from "../models/EventRegistration.js"

// CREATE EVENT
export async function createEvent(req, res) {
    try {
        const { title, description, date, location, capacity } = req.body

        if (!title || !date || !location || !capacity) {
            return res.status(400).json({ message: "Required fields missing" })
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            capacity,
            seatsRemaining: Number(capacity)
        })

        await event.save()

        res.status(201).json({
            message: "Event created successfully",
            event
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to create event" })
    }
}


// REGISTER FOR EVENT
export async function registerForEvent(req, res) {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: "User ID required" })
        }

        const event = await Event.findById(id)
        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }

        if (event.seatsRemaining <= 0) {
            return res.status(400).json({ message: "No seats remaining" })
        }

        // Check if already registered
        const existing = await EventRegistration.findOne({
            userId,
            eventId: id
        })

        if (existing) {
            return res.status(400).json({ message: "Already registered" })
        }

        // Create registration
        await EventRegistration.create({
            userId,
            eventId: id
        })

        event.seatsRemaining -= 1
        await event.save()

        res.json({
            message: "Registered successfully"
        })

    } catch (err) {

        // Handle duplicate key error safely
        if (err.code === 11000) {
            return res.status(400).json({ message: "Already registered" })
        }

        console.error(err)
        res.status(500).json({ message: "Failed to register" })
    }
}

// GET all events
export async function getEvents(req, res) {
    try {
        const events = await Event.find()
        res.json(events)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch events" })
    }
}


// GET count of registrations for a specific user
export async function getRegistrationCount(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Count how many registrations exist for this specific user
        const count = await EventRegistration.countDocuments({ userId });
        
        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch registration count" });
    }
}

export async function updateEvent(req,res){
    const id = req.params.id;
    try{
     const event = await Event.findByIdAndUpdate(id,req.body,{new:true, runValidators: true })
     console.log(event)
     if(!event) return res.status(404).json({message:"Event not found!"})
     res.status(200).json({event})
    }catch(err){
        console.log(error)
        res.status(404).json({message:"Not found!"})
    }
}

export async function deleteEvent(req,res){
    const id = req.params.id;
    try{
        const event = await Event.findByIdAndDelete(id);
        if(!event) return res.status(404).json({message:"Event not found!"})
        res.status(200).json({message:"Event deleted!"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"})
    }
}