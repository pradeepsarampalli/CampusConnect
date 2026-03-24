import '../css/Register.css';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import hide from '../assets/hide.png';
import view from '../assets/view.png';
import { useContext, useState } from 'react';
import { Context } from '../context/UserContext';

function Register() {
    const [togglePassword, settogglePassword] = useState(true);
    const [toogleConfirmP, settoogleConfirmP] = useState(true);
    const { setUser } = useContext(Context);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmP: '',
        role: 'user',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        const { name, password, confirmP, email } = formData;
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!confirmP) newErrors.confirmP = 'Confirm password is required';
        else if (password !== confirmP) newErrors.confirmP = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        if (!validateForm()) return;
        try {
            const res = await fetch('http://localhost:3001/api/auth/signup', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) return;
            setUser(formData);
            setSuccess('Account created! Redirecting to your dashboard...');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-page">
            <h1>Sign Up</h1>
            <form id="signup-form" className="login" onSubmit={handleFormSubmit}>
                <div className="app-logo">
                    <img src={logo} alt="app-logo" />
                    <p>CampusConnect</p>
                </div>
                {success && <div className="validation-success">{success}</div>}
                <div className="details">
                    <div className="input-group">
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleFormChange} />
                        {errors.name && <span className="validation-error">{errors.name}</span>}
                    </div>
                    <div className="input-group">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} />
                        {errors.email && <span className="validation-error">{errors.email}</span>}
                    </div>
                    <div className="input-group">
                        <input type={togglePassword ? 'password' : 'text'} name="password" className="password" placeholder="Password" value={formData.password} onChange={handleFormChange} />
                        <img className="toggle-password" src={togglePassword ? hide : view} alt="toggle" onClick={() => settogglePassword(!togglePassword)} />
                        {errors.password && <span className="validation-error">{errors.password}</span>}
                    </div>
                    <div className="input-group">
                        <input type={toogleConfirmP ? 'password' : 'text'} name="confirmP" className="password" placeholder="Confirm Password" value={formData.confirmP} onChange={handleFormChange} />
                        <img className="toggle-password" src={toogleConfirmP ? hide : view} alt="toggle" onClick={() => settoogleConfirmP(!toogleConfirmP)} />
                        {errors.confirmP && <span className="validation-error">{errors.confirmP}</span>}
                    </div>
                    <div className="input-group">
                        <select name="role" value={formData.role} onChange={handleFormChange}>
                            <option value="user">User</option>
                            <option value="organizer">Organizer</option>
                        </select>
                    </div>
                    <p>
                        Have an account? <Link to="/signin">Sign In</Link>
                    </p>
                    <button id="signup-btn" type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;
