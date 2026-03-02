import mongoose from "mongoose"

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pinned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Notice = mongoose.model("Notice", noticeSchema)
export default Notice

