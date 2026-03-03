import jwt from 'jsonwebtoken'

const jwt_secret = 'bigwhitepigisherebrodontpickthemsimplystupid'
export function authCheck(req,res,next){
    const token = req.cookies.jwt
    if(!token) return res.status(401).json({message:'Unauthorized access!'})
    try{
    const user = jwt.verify(token,jwt_secret)
    req.user = user;
    next()
    }
    catch(err){
        res.status(401).json({message:'Unauthorized access!'})
    }
}