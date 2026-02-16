import "../css/Login.css"
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import hide from "../assets/hide.png"
import view from "../assets/view.png"
import { useState } from "react";
function Login(){
    const [hs,setHs] = useState(true)

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(!email || !password) {
            alert("Please Enter all the details!")
            return;
        }
        const response = await fetch("/api/auth/login",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({email,password})
        })

        const data = await response.json()
        alert(data.message)
    }

     return(
    <>
    <form className="login" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <div className="app-logo">
            <img src={logo}  alt="app-logo"></img>
            <p>CampusConnect</p>
        </div>
        <div className="details">
            <input type="text" id="email" placeholder="Email or Phone" onChange={e=>{setEmail(e.target.value)}}></input>
            <div>
                <input type = {hs?"password":"text"} id="password" placeholder="Password" onChange={e=>{setPassword(e.target.value)}}></input>
                <img id="hs-password" src={hs?hide:view} alt="hide-icon" onClick={()=>setHs(!hs)}></img>
            </div>
            <p>No account? <Link to="/signup">Sign up</Link></p>
            <button type="submit" id="login">Login</button>
        </div>
    </form>
    </>)
}
export default Login;