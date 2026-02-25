import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const DBSTRING = process.env.DBSTRING || "mongodb+srv://pradeepsarampalli41_db_user:mpb01AghYnT6CYt0@cluster1.evv8afh.mongodb.net/?appName=Cluster1"

const connectDB = async ()=>{
    try{
        await mongoose.connect(DBSTRING)
    }
    catch(error){
        console.log(error)
    }
}
export default connectDB