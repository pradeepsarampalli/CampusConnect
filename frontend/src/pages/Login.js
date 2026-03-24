import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import hide from '../assets/hide.png';
import view from '../assets/view.png';
import { useContext, useState } from 'react';
import { Context } from '../context/UserContext.js';
function Login() {
    const { setUser } = useContext(Context);
    const [hs, setHs] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        if (!email || !password) {
            alert('Please Enter all the details!');
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/auth/signin', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Login failed');
                return;
            }

            setUser({
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
            });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error(err);
            alert('Login failed');
        }
    };

    return (
        <div className="auth-page">
            <form className="login" onSubmit={handleSubmit}>
                <h1>Sign in</h1>
                <div className="app-logo">
                    <img src={logo} alt="app-logo"></img>
                    <p>CampusConnect</p>
                </div>
                <div className="details">
                    <input type="text" id="email" name="email" placeholder="Email or Phone" value={formData.email} onChange={(e) => handleChange(e)}></input>
                    <div>
                        <input type={hs ? 'password' : 'text'} name="password" id="password" placeholder="Password" value={formData.password} onChange={(e) => handleChange(e)}></input>
                        <img id="hs-password" src={hs ? hide : view} alt="hide-icon" onClick={() => setHs(!hs)}></img>
                    </div>
                    <p>
                        No account? <Link to="/signup">Sign up</Link>
                    </p>
                    <button type="submit" id="login">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Login;
