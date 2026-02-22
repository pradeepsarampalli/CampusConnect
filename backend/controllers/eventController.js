import Event from '../models/Event.js'
async function deleteEvent(req,res){
    try{
        const id = req.params.id
        const event = await Event.findByIdAndDelete(id)
        console.log(event) 
        res.status(201).json("Deletion successful")
    }
    catch(err){
        console.log(err)
        res.status(500).json("Deletion Failed")
    }
}
async function editEvent(req,res){
    try{
        const id = req.params.id
        const event = await Event.findByIdAndUpdate(id,req.body,{returnDocument : 'after'})
        console.log(event)
        res.status(201).json("Update operation successful")
    }
    catch(err){
        console.log(err)
        res.status(500).json("Edit operation failed")
    }
}
async function registerEvent(req,res){
    try{
        console.log(req.body)
        
        const eventData={
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            date : req.body.date,
            time : req.body.time,
            venue : req.body.venue,
            organizer : req.body.organizer,
            capacity : req.body.capacity,
            registeredCount : req.body.registeredCount,
            status : req.body.status
        }
        const event = new Event(eventData)
        await event.save()
        res.status(201).json({message : "Event Registered"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed"})
    }
}

export default {registerEvent,deleteEvent,editEvent}