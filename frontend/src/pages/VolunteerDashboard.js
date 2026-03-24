import '../css/Dashboard.css';
import { Context } from '../context/UserContext';
import { useContext } from 'react';

function VolunteerDashboard() {
    const { user } = useContext(Context);
    const name = user?.name || 'Volunteer';
    const role = (user?.role || 'volunteer').toLowerCase();

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {name}!</h1>
                    <p className="dashboard-subtitle">Thank you for contributing to campus events.</p>
                </div>
                <span className={`role-badge role-${role}`}>Active Volunteer</span>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <p className="stat-label">Events Joined</p>
                        <p className="stat-value">5</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📌</div>
                    <div className="stat-content">
                        <p className="stat-label">Upcoming Tasks</p>
                        <p className="stat-value">3</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <p className="stat-label">Participation Level</p>
                        <p className="stat-value">High</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid wide">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">My Registered Events</h2>
                    </div>
                    <ul className="section-list">
                        <li>Tech Fest 2025 – Event Coordinator</li>
                        <li>Career Fair – Registration Desk</li>
                    </ul>
                </div>
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Upcoming Volunteering Tasks</h2>
                    </div>
                    <ul className="section-list">
                        <li>Assist with Tech Fest workshop setup.</li>
                        <li>Coordinate volunteers for Sports Day.</li>
                        <li>Support Cultural Night stage management.</li>
                    </ul>
                </div>
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Available Events</h2>
                    </div>
                    <ul className="section-list">
                        <li>Seminar: AI in Education – Volunteer slots open.</li>
                        <li>Startup Pitch Day – Mentor support needed.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default VolunteerDashboard;
