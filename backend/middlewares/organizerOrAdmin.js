import jwt from 'jsonwebtoken'
const jwt_secret = 'bigwhitepigisherebrodontpickthemsimplystupid'

export function organizerOrAdmin(req, res, next) {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ message: 'Unauthorized access!' })
    try {
        const user = jwt.verify(token, jwt_secret)
        if (!['admin', 'organizer'].includes(user.role)) {
            return res.status(403).json({ message: 'Access restricted to admins and organizers' })
        }
        req.user = user
        next()
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized access!' })
    }
}
