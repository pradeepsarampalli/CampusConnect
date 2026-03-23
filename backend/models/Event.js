import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    seatsRemaining: { type: Number },
    maxVolunteers: { type: Number,default: 0 },
    volunteersRemaining: { type: Number },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null 
    }
}, { timestamps: true })

eventSchema.pre("save", function () {
    if (this.isNew) {
        this.seatsRemaining = this.capacity
        this.volunteersRemaining = this.maxVolunteers
    }
})

const Event = mongoose.model("Event", eventSchema)
export default Event
