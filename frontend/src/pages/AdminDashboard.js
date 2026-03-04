import "../css/Dashboard.css";
import { getCurrentUser } from "../utils/auth";
import useStats from "../hooks/useStat.js";
import { useState } from "react";
import { Users, CalendarDays, Megaphone } from "lucide-react";

function AdminDashboard() {
  const user = getCurrentUser();
  const name = user?.name || "Administrator";
  const role = (user?.role || "admin").toLowerCase();
  const { stats, error } = useStats();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    capacity: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/notices", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) console.log("failed to save notice");
    } catch (err) {
      console.log(err);
    }
    setShowModal(false);
    setFormData({ title: "", description: "" });
  }

  function handleEventChange(e) {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEventSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) console.log("failed to save");
      setShowEventModal(false);
      setEventData({
        title: "",
        description: "",
        location: "",
        date: "",
        capacity: "",
      });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="dashboard-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Notice</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <input
                type="text"
                name="title"
                placeholder="Notice Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              {/* <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange}/> */}
              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEventModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Event</h2>
            <form onSubmit={handleEventSubmit} className="modal-form">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={eventData.title}
                onChange={handleEventChange}
                required
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={eventData.description}
                onChange={handleEventChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Event Location"
                value={eventData.location}
                onChange={handleEventChange}
                required
              />
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleEventChange}
                required
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={eventData.capacity}
                onChange={handleEventChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome, {name}!</h1>
          <p className="dashboard-subtitle">
            You are owner of the website(aka admin!)
          </p>
        </div>
        <span className={`role-badge role-${role}`}>Admin</span>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats ? stats.users : 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CalendarDays size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Events</p>
            <p className="stat-value">{stats ? stats.events : 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Megaphone size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Notices</p>
            <p className="stat-value">{stats ? stats.notices : 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid wide">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => setShowModal(true)}
            >
              Create Notice
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setShowEventModal(true)}
            >
              Create Event
            </button>
          </div>
        </div>
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Notices</h2>
          </div>
          <ul className="section-list">
            {stats?.recentNotices?.map((notice) => (
              <li key={notice._id}>{notice.title}</li>
            ))}
            {/* <li>Exam schedule updated for mid-semester exams.</li>
                        <li>Library open till 10 PM during exam week.</li>
                        <li>Fee payment deadline extended.</li> */}
          </ul>
        </div>
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          <ul className="section-list">
            {stats?.recentEvents?.map((event) => (
              <li key={event._id}>{event.title}</li>
            ))}
            {/* <li>Tech Fest 2025 - Feb 25, Main Auditorium</li>
                        <li>Career Fair- Mar 5, College Grounds</li>
                        <li>Cultural Night- Mar 15, Open Air Theatre</li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
