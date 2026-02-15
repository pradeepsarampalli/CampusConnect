import "../css/Register.css"
import logo from "../assets/logo.jpg"
import {Link} from 'react-router-dom'
import hide from "../assets/hide.png"
import view from "../assets/view.png"
import { useState } from "react"

function Register(){
    const [hs,setHs] = useState(true)
    const [chs,setChs] = useState(true)
    return (
        <> 
        <h1>Sign Up</h1>
    <form id="signup-form" className="login">
        <div className="app-logo">
            <img src={logo} alt="app-logo"></img>
            <p>CampusConnect</p>
        </div>
        <div className="details">
            <input type="text" id="username" placeholder="Fullname" required></input>
            <input type="email" id="email" placeholder="Email" required></input>
            <div>
                           <input type = {hs?"password":"text"} className="password" placeholder="password"></input>
                           <img id="hs-password" src={hs?hide:view} alt="hide-icon" onClick={()=>setHs(!hs)}></img>
                       <input type={chs?"password":"text"} id="confirm-password" className="password" placeholder="Confirm Password" required></input>
                       <img id="hs-password" src={chs?hide:view} alt="hide-icon" onClick={()=>setChs(!chs)}></img>
                       </div>
            <p>Have an account? <Link to="/signin">Sign In</Link></p>
            <button id="signup-btn" type="submit">Sign Up</button>
        </div>
    </form></>
    )
}

export default Register