import "../css/Register.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';
import hide from "../assets/hide.png";
import view from "../assets/view.png";
import { useState } from "react";

function Register() {
    const [hs, setHs] = useState(true);
    const [chs, setChs] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmP, setConfirmP] = useState("");
    const [name, setName] = useState("");

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!confirmP) newErrors.confirmP = "Confirm password is required";
        else if (password !== confirmP) newErrors.confirmP = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess("");
        if (!validate()) return;

        // Frontend validation passed - show success (no backend call)
        setSuccess("Registration form is valid! (Frontend validation only)");
    };

    return (
        <div className="auth-page">
            <h1>Sign Up</h1>
            <form id="signup-form" className="login" onSubmit={handleSubmit}>
                <div className="app-logo">
                    <img src={logo} alt="app-logo" />
                    <p>CampusConnect</p>
                </div>
                {success && <div className="validation-success">{success}</div>}
                <div className="details">
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <span className="validation-error">{errors.name}</span>}
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="validation-error">{errors.email}</span>}
                    </div>
                    <div className="input-group">
                        <input
                            type={hs ? "password" : "text"}
                            className="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <img
                            className="toggle-password"
                            src={hs ? hide : view}
                            alt="toggle"
                            onClick={() => setHs(!hs)}
                        />
                        {errors.password && <span className="validation-error">{errors.password}</span>}
                    </div>
                    <div className="input-group">
                        <input
                            type={chs ? "password" : "text"}
                            id="confirm-password"
                            className="password"
                            placeholder="Confirm Password"
                            value={confirmP}
                            onChange={(e) => setConfirmP(e.target.value)}
                        />
                        <img
                            className="toggle-password"
                            src={chs ? hide : view}
                            alt="toggle"
                            onClick={() => setChs(!chs)}
                        />
                        {errors.confirmP && <span className="validation-error">{errors.confirmP}</span>}
                    </div>
                    <p>Have an account? <Link to="/signin">Sign In</Link></p>
                    <button id="signup-btn" type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default Register;
