import '../css/Dashboard.css';
import { Context } from '../context/UserContext.js';
import useStats from '../hooks/useStat.js';
import { useContext, useState, useEffect } from 'react';
import { Users, CalendarDays, Megaphone, HandHelping, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import {API_BASE_URL} from "../config/api.js"
function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#fffbeb', color: '#b45309', label: 'Pending' },
    approved: { bg: '#f0fdf4', color: '#16a34a', label: 'Approved' },
    rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

function AdminDashboard() {
  const { user } = useContext(Context);
  const name = user?.name || 'Administrator';
  const role = (user?.role || 'admin').toLowerCase();
  const { stats } = useStats();

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeData, setNoticeData] = useState({
    title: '',
    description: '',
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
    maxVolunteers: '',
    timeHour: '12',
    timeMinute: '00',
    timePeriod: 'AM',
  });

  const [events, setEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [applications, setApplications] = useState({});
  const [loadingApps, setLoadingApps] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data.filter((e) => e.maxVolunteers > 0) : []))
      .catch(console.error);
  }, []);

  function handleNoticeChange(e) {
    const { name, value } = e.target;
    setNoticeData((prev) => ({ ...prev, [name]: value }));
  }
  async function handleNoticeSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/notices`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeData),
      });
      if (!res.ok) console.error('Failed to save notice');
    } catch (err) {
      console.error(err);
    }
    setShowNoticeModal(false);
    setNoticeData({ title: '', description: '' });
  }

  function handleEventChange(e) {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  }
  async function handleEventSubmit(e) {
    e.preventDefault();
    const { timeHour, timeMinute, timePeriod, ...rest } = eventData;
    const payload = { ...rest, time: `${timeHour}:${timeMinute}  ${timePeriod}` };
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(res);
      if (res.ok) {
        const { event } = await res.json();
        if (event.maxVolunteers >= 0) setEvents((prev) => [...prev, event]);
      } else {
        console.error('Failed to save event');
      }
    } catch (err) {
      console.error(err);
    }
    setShowEventModal(false);
    setEventData({
      title: '',
      description: '',
      location: '',
      date: '',
      capacity: '',
      maxVolunteers: '',
      timeHour: '12',
      timeMinute: '00',
      timePeriod: 'AM',
    });
  }

  async function handleToggleEvent(eventId) {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
      return;
    }
    setExpandedEventId(eventId);
    if (applications[eventId]) return;

    setLoadingApps((prev) => ({ ...prev, [eventId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/volunteer-applications`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setApplications((prev) => ({
          ...prev,
          [eventId]: data.applications || [],
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps((prev) => ({ ...prev, [eventId]: false }));
    }
  }

  async function handleStatusUpdate(eventId, applicationId, newStatus) {
    setActionLoading(applicationId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/volunteer/${applicationId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) => ({
          ...prev,
          [eventId]: (prev[eventId] || []).map((a) => (a._id === applicationId ? { ...a, status: newStatus } : a)),
        }));
        if (newStatus === 'rejected') {
          setEvents((prev) => prev.map((e) => (e._id === eventId ? { ...e, volunteersRemaining: (e.volunteersRemaining || 0) + 1 } : e)));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  const pendingTotal = stats?.volunteerPending ?? 0;

  return (
    <div className="dashboard-page">
      {showNoticeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Notice</h2>
            <form onSubmit={handleNoticeSubmit} className="modal-form">
              <input type="text" name="title" placeholder="Notice Title" value={noticeData.title} onChange={handleNoticeChange} required />
              <textarea name="description" placeholder="Description" value={noticeData.description} onChange={handleNoticeChange} required />
              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button type="button" className="secondary-btn" onClick={() => setShowNoticeModal(false)}>
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
              <input type="text" name="title" placeholder="Event Title" value={eventData.title} onChange={handleEventChange} required />
              <textarea name="description" placeholder="Event Description" value={eventData.description} onChange={handleEventChange} required />
              <input type="text" name="location" placeholder="Event Location" value={eventData.location} onChange={handleEventChange} required />
              <input type="date" name="date" value={eventData.date} onChange={handleEventChange} required />
              <input type="number" name="capacity" placeholder="Attendee Capacity" value={eventData.capacity} onChange={handleEventChange} required />
              <input type="number" name="maxVolunteers" placeholder="Volunteer Slots (0 = none)" value={eventData.maxVolunteers} onChange={handleEventChange} />
              <div className="form-group">
                <label className="form-label" style={{ opacity: 0.7 }}>
                  Event Time
                </label>
                <div className="time-input-group">
                  <select name="timeHour" value={eventData.timeHour} onChange={handleEventChange}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const h = String(i + 1).padStart(2, '0');
                      return (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      );
                    })}
                  </select>

                  <select name="timeMinute" value={eventData.timeMinute} onChange={handleEventChange}>
                    {['00', '15', '30', '45'].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select name="timePeriod" value={eventData.timePeriod} onChange={handleEventChange}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button type="button" className="secondary-btn" onClick={() => setShowEventModal(false)}>
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
          <p className="dashboard-subtitle">You are owner of the website (aka admin!)</p>
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
            <p className="stat-value">{stats?.users ?? 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CalendarDays size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Events</p>
            <p className="stat-value">{stats?.events ?? 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Megaphone size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Notices</p>
            <p className="stat-value">{stats?.notices ?? 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <HandHelping size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Volunteer Applications</p>
            <p className="stat-value">{pendingTotal}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid wide">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button type="button" className="primary-btn" onClick={() => setShowNoticeModal(true)}>
              Create Notice
            </button>
            <button type="button" className="secondary-btn" onClick={() => setShowEventModal(true)}>
              Create Event
            </button>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Notices</h2>
          </div>
          <ul className="section-list">
            {stats?.recentNotices?.map((n) => (
              <li key={n._id}>{n.title}</li>
            ))}
            {(!stats?.recentNotices || stats.recentNotices.length === 0) && <li className="empty-msg">No notices yet.</li>}
          </ul>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          <ul className="section-list">
            {stats?.recentEvents?.map((e) => (
              <li key={e._id}>{e.title}</li>
            ))}
            {(!stats?.recentEvents || stats.recentEvents.length === 0) && <li className="empty-msg">No events yet.</li>}
          </ul>
        </div>
      </div>

      <div className="dashboard-section vol-admin-section">
        <div className="section-header">
          <h2 className="section-title">
            <HandHelping size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Volunteer Applications
            {pendingTotal > 0 && (
              <span className="tab-badge" style={{ marginLeft: 8 }}>
                {pendingTotal}
              </span>
            )}
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <p>No events with volunteer slots have been created yet.</p>
          </div>
        ) : (
          <div className="vol-admin-list">
            {events.map((ev) => {
              const isOpen = expandedEventId === ev._id;
              const apps = applications[ev._id] || [];
              const loading = loadingApps[ev._id];
              const pendingCount = apps.filter((a) => a.status === 'pending').length;

              return (
                <div key={ev._id} className="vol-admin-event">
                  <button className="vol-admin-event-header" onClick={() => handleToggleEvent(ev._id)} type="button">
                    <div className="vol-admin-event-info">
                      <strong>{ev.title}</strong>
                      <span className="vol-admin-event-meta">
                        {ev.volunteersRemaining ?? '?'} / {ev.maxVolunteers} slots remaining
                        {pendingCount > 0 && (
                          <span
                            className="tab-badge"
                            style={{
                              marginLeft: 8,
                            }}
                          >
                            {pendingCount} pending
                          </span>
                        )}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div className="vol-admin-apps">
                      {loading && <p className="empty-msg">Loading applications…</p>}
                      {!loading && apps.length === 0 && <p className="empty-msg">No applications yet for this event.</p>}
                      {!loading &&
                        apps.map((app) => (
                          <div key={app._id} className="vol-admin-app-row">
                            <div className="vol-admin-app-info">
                              <span className="vol-admin-app-name">{app.userId?.name || 'Unknown'}</span>
                              <span className="vol-admin-app-email">{app.userId?.email}</span>
                              <span className="vol-admin-app-date">
                                Applied{' '}
                                {new Date(app.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="vol-admin-app-actions">
                              <StatusBadge status={app.status} />
                              {app.status !== 'approved' && (
                                <button className="vol-action-btn approve" title="Approve" disabled={actionLoading === app._id} onClick={() => handleStatusUpdate(ev._id, app._id, 'approved')}>
                                  <Check size={14} />
                                </button>
                              )}
                              {app.status !== 'rejected' && (
                                <button className="vol-action-btn reject" title="Reject" disabled={actionLoading === app._id} onClick={() => handleStatusUpdate(ev._id, app._id, 'rejected')}>
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
