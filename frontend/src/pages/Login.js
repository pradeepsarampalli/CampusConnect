import "../css/Login.css"
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import hide from "../assets/hide.png"
import view from "../assets/view.png"
import { useState } from "react";
function Login(){
    const [hs,setHs] = useState(true)
     return(
    <>
    <form className="login">
        <h1>Sign in</h1>
        <div className="app-logo">
            <img src={logo}  alt="app-logo"></img>
            <p>CampusConnect</p>
        </div>
        <div className="details">
            <input type="text" id="email" placeholder="Email or Phone"></input>
            <div>
                <input type = {hs?"password":"text"} id="password" placeholder="Password"></input>
                <img id="hs-password" src={hs?hide:view} alt="hide-icon" onClick={()=>setHs(!hs)}></img>
            </div>
            <p>No account? <Link to="/signup">Sign up</Link></p>
            <button type="submit" id="login">Login</button>
        </div>
    </form>
    </>)
}
export default Login;