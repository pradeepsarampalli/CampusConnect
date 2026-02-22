import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    category:{
        type: String        
    },
    date:{
        type: Date,
        required: true 
    },
    time:{
        type: String
    },
    venue:{
        type: String
    },
    organizer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" //admin or organizer too
    },
    capacity:{
        type: Number
    },
    registeredCount:{
        type: Number,
        default:0
    },
    status:{
        type: String,
        enum:["upcoming","ongoing","completed"],
        default:"upcoming"
    }
})

const Event = mongoose.model("Event",eventSchema)
export default Event 