import '../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import hide from '../assets/hide.png';
import {API_BASE_URL} from "../config/api.js"
import view from '../assets/view.png';
import { useContext, useState } from 'react';
import { Context } from '../context/UserContext.js';

function Login() {
  const { setUser } = useContext(Context);
  const [hs, setHs] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setErrorMsg('Please enter all details');
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Login failed');
        setShowModal(true);
        setLoading(false);
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
      setErrorMsg('Server error. Try again.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Login Failed</h3>
            <p>{errorMsg}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
      <form className="login" onSubmit={handleSubmit}>
        <h1>Sign in</h1>

        <div className="details">
          <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

          <div className="password-field">
            <input type={hs ? 'password' : 'text'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <img src={hs ? hide : view} alt="toggle" onClick={() => setHs(!hs)} />
          </div>

          <p>
            No account? <Link to="/signup">Sign up</Link>
          </p>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
