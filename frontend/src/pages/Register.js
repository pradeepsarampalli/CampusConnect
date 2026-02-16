import "../css/Register.css"
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'
import hide from "../assets/hide.png"
import view from "../assets/view.png"
import { useState } from "react"

function Register() {
    const [hs, setHs] = useState(true)
    const [chs, setChs] = useState(true)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmP, setConfirmP] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email || !password || !confirmP || !name ){
            alert("Please fill all the details!")
            return;
        }

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name:name, email:email, password:password })
        });

        const data = await response.json();
        alert(data.message)
    }
    return (
        <>
            <h1>Sign Up</h1>
            <form id="signup-form" className="login" onSubmit={handleSubmit}>
                <div className="app-logo">
                    <img src={logo} alt="app-logo"></img>
                    <p>CampusConnect</p>
                </div>
                <div className="details">
                    <input type="text" id="username" placeholder="Fullname" required onChange={e => { setName(e.target.value) }}></input>
                    <input type="email" id="email" placeholder="Email" required onChange={e => { setEmail(e.target.value) }}></input>
                    <div>
                        <input type={hs ? "password" : "text"} className="password" placeholder="password" onChange={e => { setPassword(e.target.value) }}></input>
                        <img id="hs-password" src={hs ? hide : view} alt="hide-icon" onClick={() => setHs(!hs)}></img>
                        <input type={chs ? "password" : "text"} id="confirm-password" className="password" placeholder="Confirm Password" required onChange={e => { setConfirmP(e.target.value) }}></input>
                        <img id="hs-password" src={chs ? hide : view} alt="hide-icon" onClick={() => setChs(!chs)}></img>
                    </div>
                    <p>Have an account? <Link to="/signin">Sign In</Link></p>
                    <button id="signup-btn" type="submit">Sign Up</button>
                </div>
            </form></>
    )
}

export default Register