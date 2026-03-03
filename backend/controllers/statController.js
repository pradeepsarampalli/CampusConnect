import Notice from "../models/Notice.js"
import Event from "../models/Event.js"
import User from "../models/User.js"
export async function getStats(req,res){
    try{
        const [noticeCount,eventCount,userCount,recentEvents,recentNotices] = await Promise.all([Notice.countDocuments(),Event.countDocuments(),User.countDocuments(),
        Event.find().sort({createdAt:-1}).limit(4),
        Notice.find().sort({createdAt:-1}).limit(4)]);
        res.status(200).json({notices:noticeCount,events:eventCount,users:userCount,recentEvents:recentEvents,recentNotices})
    }
    catch(err){
        res.status(500).json({message:"failed to fetch!"})
    }
}