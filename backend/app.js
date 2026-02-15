const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

app.get("/api/test",(req,res)=>{
    res.json({message:"backed is connected!"})
})
module.exports = app;
