import { useState, useEffect, useContext } from 'react';
import '../css/Dashboard.css';
import {Context} from "../context/UserContext.js"

function UserDashboard() {
    const {user} = useContext(Context);
    const name = user?.name || 'Student';
    // const name = user
    const role = (user?.role || 'user').toLowerCase();

    const [events, setEvents] = useState([]);
    const [notices, setNotices] = useState([]);
    const [stats, setStats] = useState({ eventCount: 0, noticeCount: 0, regCount: 0 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [eventRes, noticeRes] = await Promise.all([
                    fetch('http://localhost:3001/api/events',{ credentials: "include",}),
                    fetch('http://localhost:3001/api/notices',{ credentials: "include",})
                ]);

                if (!eventRes.ok || !noticeRes.ok) {
                    throw new Error(`HTTP Error! Status: ${eventRes.status}`);
                }

                const eventData = await eventRes.json();
                const noticeData = await noticeRes.json();

                console.log("Data Received:", { eventData, noticeData });

                setEvents(eventData.slice(0, 2));
                setNotices(noticeData.slice(0, 2));
                setStats({
                    eventCount: eventData.length,
                    noticeCount: noticeData.length,
                    regCount: 0 
                });
            } catch (err) {
                console.error("DASHBOARD FETCH ERROR:", err.message);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {name} 👋</h1>
                    <p className="dashboard-subtitle">Here is what&apos;s happening on campus.</p>
                </div>
                <span className={`role-badge role-${role}`}>User</span>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <p className="stat-label">Upcoming Events</p>
                        <p className="stat-value">{stats.eventCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📢</div>
                    <div className="stat-content">
                        <p className="stat-label">Recent Notices</p>
                        <p className="stat-value">{stats.noticeCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <p className="stat-label">My Registrations</p>
                        <p className="stat-value">{stats.regCount}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid wide">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Upcoming Events</h2>
                    </div>
                    <ul className="section-list">
                        {events.length > 0 ? (
                            events.map(event => (
                                <li key={event._id}>{event.title}</li>
                            ))
                        ) : (
                            <li className="empty-msg">No upcoming events.</li>
                        )}
                    </ul>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Notices</h2>
                    </div>
                    <ul className="section-list">
                        {notices.length > 0 ? (
                            notices.map(notice => (
                                <li key={notice._id}>{notice.title}</li>
                            ))
                        ) : (
                            <li className="empty-msg">No recent notices.</li>
                        )}
                    </ul>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">My Registrations</h2>
                    </div>
                    <div className="empty-state">
                        {stats.regCount > 0 ? (
                            <p>You have registered for {stats.regCount} event(s).</p>
                        ) : (
                            <p>You have not registered for any events yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
