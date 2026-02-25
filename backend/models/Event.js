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
        type: String,
        required: true 
    },
    time:{
        type: String
    },
    venue:{
        type: String
    },
    organizer:{
        type: String,
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
    }
})

const Event = mongoose.model("Event",eventSchema)
export default Event 