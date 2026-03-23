import mongoose from "mongoose"

const registrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    qrCode: {
        type: String, 
        default: null
    }
}, { timestamps: true })

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true })
const EventRegistration = mongoose.model("EventRegistration", registrationSchema)
export default EventRegistration
