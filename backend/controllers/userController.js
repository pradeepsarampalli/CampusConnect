import User  from '../models/User.js'
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const jwt_secret = 'bigwhitepigisherebrodontpickthemsimplystupid'
const saltRounds = 10

export async function getUsers(req,res){
    try{
        const users = await User.find();
        res.status(200).json({users:users})
    }
    catch(err){
        res.status(500).json({message:"Failed to fetch users!"})
    }
}

export async function signUp(req,res) {
    try{
        const {email,password,name} =req.body
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const user = await User.create({name,email,password:hashedPassword});
        const token = jwt.sign({id:user._id,role:user.role},jwt_secret)
        res.cookie('jwt',token,{secure:false,httpOnly:true})
        res.status(201).json({user:user})
    }
    catch(err){
        res.status(500).json({message:"Failed"})
    }
}

export async function signIn(req,res){
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not registered!"});
        const isCorrect = await bcrypt.compare(password,user.password);
        if(!isCorrect) return res.status(401).json({message:"Wrong password!"});
        const token = jwt.sign(
            {id:user._id,role:user.role},
            jwt_secret,
            {expiresIn:"1d"}
        );
        res.cookie("jwt",token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:24*60*60*1000
        });
        res.status(200).json({
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        });

    }catch(err){
        res.status(500).json({message:"An error has occurred!"});
    }
}

export function signOut(req, res) {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: false 
    });
    res.status(200).json({ message:"Logged out successfully"});
}


export async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id).select("name email role avatarUrl");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
}
