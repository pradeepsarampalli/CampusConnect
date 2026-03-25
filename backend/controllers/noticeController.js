import Notice from "../models/Notice.js"

export async function getNotice(req, res) {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 })
        res.json(notices)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to load notices" })
    }
}

export async function createNotice(req,res){
    try{
        const {title,description,pinned,createdAt} = req.body
        const notice = await Notice.create({
            title,
            description,
            pinned,
            createdAt
        })
        await notice.save();
        res.status(201).json({message:"Notice created succesfully!"})
    }
    catch(err){
        res.status(500).json({message:"Notice not saved an error occured!"})
    }
}

export async function deleteNotice(req,res){
    try{
        const {id} = req.params;
        const notice = await Notice.findByIdAndDelete(id)
        if(!notice) return res.status(404).json({message:"Notice is not found!"})
        res.status(200).json({message:"Notice deleted!"})
    }
    catch(err){
        res.status(404).json({message:"Notice is not found!"})
    }
}

export async function updateNotice(req,res){
    try{
        const {id} = req.params
        const updated = await Notice.findByIdAndUpdate(id,{...req.body},{ new: true, runValidators: true } )
        if (!updated) return res.status(404).json({ message: "Notice not found!" });
        return res.status(200).json(updated);
    } catch (err) {
        return res.status(500).json({ message: "Couldn't update notice!" });
    }
}


