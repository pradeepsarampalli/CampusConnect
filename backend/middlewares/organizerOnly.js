import jwt from 'jsonwebtoken'
import User from '../models/User.js'
const jwt_secret = 'bigwhitepigisherebrodontpickthemsimplystupid'

export async function organizerOnly(req,res,next){
    const token = req.cookies.jwt
    if(!token) return res.status(401).json({message:'Unauthotized access!'})
    try{
    const user = jwt.verify(token,jwt_secret)
    if(user.role!=='organizer') return res.status(403).json({message:'Unauthotized access!(Only organizer can access this)'})
    req.user=user
    next();
    }
    catch(err){
        res.status(401).json({message:'Unauthotized access!'})
    }
}