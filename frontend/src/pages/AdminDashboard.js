import '../css/Dashboard.css';
import { getCurrentUser } from '../utils/auth';

function AdminDashboard() {
    const user = getCurrentUser();
    const name = user?.name || 'Administrator';
    const role = (user?.role || 'admin').toLowerCase();

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {name} 👋</h1>
                    <p className="dashboard-subtitle">You are managing the campus as an admin.</p>
                </div>
                <span className={`role-badge role-${role}`}>Admin</span>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <p className="stat-label">Total Users</p>
                        <p className="stat-value">1,248</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <p className="stat-label">Total Events</p>
                        <p className="stat-value">36</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📢</div>
                    <div className="stat-content">
                        <p className="stat-label">Total Notices</p>
                        <p className="stat-value">18</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid wide">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Quick Actions</h2>
                    </div>
                    <div className="quick-actions">
                        <button type="button" className="primary-btn">Create Notice</button>
                        <button type="button" className="secondary-btn">Create Event</button>
                    </div>
                </div>
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Notices</h2>
                    </div>
                    <ul className="section-list">
                        <li>Exam schedule updated for mid-semester exams.</li>
                        <li>Library open till 10 PM during exam week.</li>
                        <li>Fee payment deadline extended.</li>
                    </ul>
                </div>
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Upcoming Events</h2>
                    </div>
                    <ul className="section-list">
                        <li>Tech Fest 2025 – Feb 25, Main Auditorium</li>
                        <li>Career Fair – Mar 5, College Grounds</li>
                        <li>Cultural Night – Mar 15, Open Air Theatre</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;


