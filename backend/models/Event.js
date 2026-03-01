import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    seatsRemaining: {
        type: Number
    }
}, { timestamps: true })

// Automatically set seatsRemaining = capacity before saving
eventSchema.pre("save", function (next) {
    if (this.isNew) {
        this.seatsRemaining = this.capacity
    } 
})

const Event = mongoose.model("Event", eventSchema)

export default Event