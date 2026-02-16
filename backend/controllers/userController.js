import User  from '../models/User.js'

async function register(req,res) {
    try{
        const {email,password,name} =req.body
        const user = new User({
            name,email,password
        });

        await user.save()
        res.status(201).json({message:"User Registered"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed"})
    }
}
export default register


