import express from 'express'
import { getStats } from '../controllers/statController.js'
const statRouter =new  express.Router()
statRouter.get("/",getStats)
export default statRouter