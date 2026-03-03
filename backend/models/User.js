import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["volunteer", "user",'organizer'],
        default: "user"
    },
    avatarUrl: {
        type: String
    }
})

const User = mongoose.model("User", userSchema);
export default User
