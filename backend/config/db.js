import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const DBSTRING = process.env.DBSTRING || "Mongo-URI-String-Here"

const connectDB = async ()=>{
    try{
        await mongoose.connect(DBSTRING)
    }
    catch(error){
        console.log(error)
    }
}
export default connectDB