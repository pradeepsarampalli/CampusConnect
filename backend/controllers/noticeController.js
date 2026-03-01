import Notice from "../models/Notice.js"

export async function getNotices(req, res) {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 })
        res.json(notices)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to load notices" })
    }
}

