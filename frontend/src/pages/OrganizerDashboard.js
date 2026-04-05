import { useState, useEffect, useContext } from 'react';
import '../css/Dashboard.css';
import {API_BASE_URL} from "../config/api.js"
import { Context } from '../context/UserContext.js';
import { CalendarDays, Users, HandHelping, ChevronDown, ChevronUp, Check, X, Plus, Pencil, Trash2, QrCode, Download } from 'lucide-react';

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

function QRModal({ qrCode, title, onClose }) {
  const dl = () => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = `${title.replace(/\s+/g, '_')}_pass.png`;
    a.click();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal qr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qr-close-btn" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="qr-modal-header">
          <QrCode size={22} />
          <h2>Attendee QR</h2>
        </div>
        <p className="qr-event-name">{title}</p>
        <div className="qr-image-wrapper">
          <img src={qrCode} alt="QR" className="qr-image" />
        </div>
        <button className="download-btn" onClick={dl}>
          <Download size={14} style={{ marginRight: 6 }} /> Download
        </button>
      </div>
    </div>
  );
}

function OrganizerDashboard() {
  const { user } = useContext(Context);
  const name = user?.name || 'Organizer';
  const [deleteModal, setDeleteModal] = useState({ show: false, eventId: null });
  const [activeTab, setActiveTab] = useState('overview');
  const [myEvents, setMyEvents] = useState([]);

  const [regEventId, setRegEventId] = useState(null);
  const [regLoading, setRegLoading] = useState(false);
  const [registrations, setRegistrations] = useState({});

  const [volEventId, setVolEventId] = useState(null);
  const [volLoading, setVolLoading] = useState(false);
  const [volApps, setVolApps] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
    maxVolunteers: '',
    timeHour: '',
    timeMinute: '',
    timePeriod: '',
  });

  function handleInputChange(e) {
    setEventForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  const [qrModal, setQrModal] = useState(null);

  const fmt = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE_URL}/api/events/my/events`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => setMyEvents(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [user]);

  function openCreate() {
    setEditingEvent(null);
    setEventForm({
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
    setShowEventModal(true);
  }
  function openEdit(ev) {
    let hour = '12',
      minute = '00',
      period = 'AM';

    if (ev.time) {
      const [h, rest] = ev.time.split(':');
      const [m, p] = rest.split(' ');
      hour = h;
      minute = m;
      period = p;
    }

    setEditingEvent(ev);
    setEventForm({
      title: ev.title,
      description: ev.description || '',
      location: ev.location,
      date: ev.date?.split('T')[0] || '',
      capacity: ev.capacity,
      maxVolunteers: ev.maxVolunteers || '',
      timeHour: hour,
      timeMinute: minute,
      timePeriod: period,
    });

    setShowEventModal(true);
  }
  async function handleEventSubmit(e) {
    e.preventDefault();
    const payload = {
      ...eventForm,
      time: `${eventForm.timeHour}:${eventForm.timeMinute} ${eventForm.timePeriod}`,
    };
    const method = editingEvent ? 'PUT' : 'POST';
    const url = editingEvent ? `${API_BASE_URL}/api/events/${editingEvent._id}` : `${API_BASE_URL}/api/events`;
    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        const saved = data.event;
        setMyEvents((prev) => (editingEvent ? prev.map((e) => (e._id === saved._id ? saved : e)) : [...prev, saved]));
      }
    } catch (err) {
      console.error(err);
    }
    setShowEventModal(false);
  }
  async function handleDeleteEvent() {
    const evId = deleteModal.eventId;

    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${evId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setMyEvents((prev) => prev.filter((e) => e._id !== evId));
      }
    } catch (err) {
      console.error(err);
    }

    setDeleteModal({ show: false, eventId: null });
  }

  async function toggleRegistrations(evId) {
    if (regEventId === evId) {
      setRegEventId(null);
      return;
    }
    setRegEventId(evId);
    if (registrations[evId]) return;
    setRegLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${evId}/registrations`, {
        credentials: 'include',
      });
      const data = await res.json();
      setRegistrations((prev) => ({
        ...prev,
        [evId]: data.registrations || [],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setRegLoading(false);
    }
  }

  async function toggleVolunteers(evId) {
    if (volEventId === evId) {
      setVolEventId(null);
      return;
    }
    setVolEventId(evId);
    if (volApps[evId]) return;
    setVolLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${evId}/volunteer-applications`, {
        credentials: 'include',
      });
      const data = await res.json();
      setVolApps((prev) => ({
        ...prev,
        [evId]: data.applications || [],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setVolLoading(false);
    }
  }

  async function handleVolStatus(evId, appId, status) {
    setActionLoading(appId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${evId}/volunteer/${appId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVolApps((prev) => ({
          ...prev,
          [evId]: (prev[evId] || []).map((a) => (a._id === appId ? { ...a, status } : a)),
        }));
        if (status === 'rejected') {
          setMyEvents((prev) => prev.map((e) => (e._id === evId ? { ...e, volunteersRemaining: (e.volunteersRemaining || 0) + 1 } : e)));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  const totalSeats = myEvents.reduce((s, e) => s + (e.capacity || 0), 0);
  const totalRegistered = myEvents.reduce((s, e) => s + ((e.capacity || 0) - (e.seatsRemaining || 0)), 0);
  const totalVolSlots = myEvents.reduce((s, e) => s + (e.maxVolunteers || 0), 0);
  const volFilled = myEvents.reduce((s, e) => s + ((e.maxVolunteers || 0) - (e.volunteersRemaining || 0)), 0);

  return (
    <div className="dashboard-page">
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h3>Delete Event</h3>
            <p>Are you sure you want to delete this event and all its registrations?</p>

            <div className="modal-actions">
              <button className="delete-confirm-btn" onClick={handleDeleteEvent}>
                Yes, Delete
              </button>

              <button className="secondary-btn" onClick={() => setDeleteModal({ show: false, eventId: null })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {qrModal && <QRModal qrCode={qrModal.qrCode} title={qrModal.title} onClose={() => setQrModal(null)} />}

      {showEventModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleEventSubmit} className="modal-form">
              <input type="text" name="title" placeholder="Event Title" value={eventForm.title} onChange={(e) => handleInputChange(e)} required />
              <textarea name="description" placeholder="Description" value={eventForm.description} onChange={(e) => handleInputChange(e)} />
              <input type="text" name="location" placeholder="Location" value={eventForm.location} onChange={(e) => handleInputChange(e)} required />
              <input type="date" name="date" value={eventForm.date} onChange={(e) => handleInputChange(e)} required />
              <input type="number" name="capacity" placeholder="Attendee Capacity" value={eventForm.capacity} onChange={(e) => handleInputChange(e)} required />
              <input type="number" name="maxVolunteers" placeholder="Volunteer Slots (0 = none)" value={eventForm.maxVolunteers} onChange={(e) => handleInputChange(e)} />
              <div className="form-group">
                <label className="form-label" style={{ opacity: 0.7 }}>
                  Event Time
                </label>
                <div className="time-input-group">
                  <select name="timeHour" value={eventForm.timeHour} onChange={(e) => handleInputChange(e)}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const h = String(i + 1).padStart(2, '0');
                      return (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      );
                    })}
                  </select>

                  <select name="timeMinute" value={eventForm.timeMinute} onChange={(e) => handleInputChange(e)}>
                    {['00', '15', '30', '45'].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select name="timePeriod" value={eventForm.timePeriod} onChange={(e) => handleInputChange(e)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  {editingEvent ? 'Update' : 'Create'}
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
          <h1 className="dashboard-title">Welcome, {name} !</h1>
          <p className="dashboard-subtitle">Manage your events, registrations and volunteers.</p>
        </div>
        <span className="role-badge role-organizer">Organizer</span>
      </div>

      <div className="dashboard-tabs">
        {['overview', 'registrations', 'volunteers'].map((tab) => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <CalendarDays size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">My Events</p>
                <p className="stat-value">{myEvents.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Registrations</p>
                <p className="stat-value">
                  {totalRegistered} / {totalSeats}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <HandHelping size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Volunteer Slots Filled</p>
                <p className="stat-value">
                  {volFilled} / {totalVolSlots}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-section" style={{ marginTop: 8 }}>
            <div
              className="section-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2 className="section-title">My Events</h2>
              <button className="org-create-btn" onClick={openCreate}>
                <Plus size={14} style={{ marginRight: 5 }} /> Create Event
              </button>
            </div>

            {myEvents.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any events yet.</p>
              </div>
            ) : (
              <div className="org-event-list">
                {myEvents.map((ev) => (
                  <div key={ev._id} className="org-event-row">
                    <div className="org-event-info">
                      <strong>{ev.title}</strong>
                      <span className="org-event-meta">
                        {fmt(ev.date)} · {ev.location}
                      </span>
                      <div className="org-event-chips">
                        <span className="org-chip blue">
                          {ev.capacity - ev.seatsRemaining} / {ev.capacity} registered
                        </span>
                        {ev.maxVolunteers > 0 && (
                          <span className="org-chip teal">
                            {ev.maxVolunteers - ev.volunteersRemaining} / {ev.maxVolunteers} volunteers
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="org-event-actions">
                      <button className="icon-btn edit-btn" onClick={() => openEdit(ev)} title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => setDeleteModal({ show: true, eventId: ev._id })} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'registrations' && (
        <div className="dashboard-section" style={{ marginTop: 8 }}>
          <div className="section-header">
            <h2 className="section-title">Attendee Registrations</h2>
          </div>
          <p
            style={{
              fontSize: 13,
              color: '#64748b',
              marginBottom: 14,
            }}
          >
            Click an event to see who registered.
          </p>
          {myEvents.length === 0 ? (
            <div className="empty-state">
              <p>No events yet.</p>
            </div>
          ) : (
            <div className="vol-admin-list">
              {myEvents.map((ev) => {
                const isOpen = regEventId === ev._id;
                const regs = registrations[ev._id] || [];
                const filled = (ev.capacity || 0) - (ev.seatsRemaining || 0);
                return (
                  <div key={ev._id} className="vol-admin-event">
                    <button className="vol-admin-event-header" onClick={() => toggleRegistrations(ev._id)} type="button">
                      <div className="vol-admin-event-info">
                        <strong>{ev.title}</strong>
                        <span className="vol-admin-event-meta">
                          {filled} / {ev.capacity} seats filled · {fmt(ev.date)}
                        </span>
                      </div>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div className="vol-admin-apps">
                        {regLoading && <p className="empty-msg">Loading…</p>}
                        {!regLoading && regs.length === 0 && <p className="empty-msg">No registrations yet.</p>}
                        {!regLoading &&
                          regs.map((r) => (
                            <div key={r._id} className="vol-admin-app-row">
                              <div className="vol-admin-app-info">
                                <span className="vol-admin-app-name">{r.userId?.name || 'Unknown'}</span>
                                <span className="vol-admin-app-email">{r.userId?.email}</span>
                                <span className="vol-admin-app-date">Registered {fmt(r.createdAt)}</span>
                              </div>
                              <div className="vol-admin-app-actions">
                                {r.qrCode && (
                                  <button
                                    className="qr-inline-btn"
                                    onClick={() =>
                                      setQrModal({
                                        qrCode: r.qrCode,
                                        title: r.userId?.name || 'Attendee',
                                      })
                                    }
                                  >
                                    <QrCode size={13} /> QR
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
      )}

      {activeTab === 'volunteers' && (
        <div className="dashboard-section" style={{ marginTop: 8 }}>
          <div className="section-header">
            <h2 className="section-title">Volunteer Applications</h2>
          </div>
          <p
            style={{
              fontSize: 13,
              color: '#64748b',
              marginBottom: 14,
            }}
          >
            Click an event to review and approve or reject applications.
          </p>
          {myEvents.filter((e) => e.maxVolunteers > 0).length === 0 ? (
            <div className="empty-state">
              <p>None of your events have volunteer slots enabled.</p>
            </div>
          ) : (
            <div className="vol-admin-list">
              {myEvents
                .filter((e) => e.maxVolunteers > 0)
                .map((ev) => {
                  const isOpen = volEventId === ev._id;
                  const apps = volApps[ev._id] || [];
                  const pending = apps.filter((a) => a.status === 'pending').length;
                  return (
                    <div key={ev._id} className="vol-admin-event">
                      <button className="vol-admin-event-header" onClick={() => toggleVolunteers(ev._id)} type="button">
                        <div className="vol-admin-event-info">
                          <strong>{ev.title}</strong>
                          <span className="vol-admin-event-meta">
                            {ev.volunteersRemaining} / {ev.maxVolunteers} slots remaining
                            {pending > 0 && (
                              <span
                                className="tab-badge"
                                style={{
                                  marginLeft: 8,
                                }}
                              >
                                {pending} pending
                              </span>
                            )}
                          </span>
                        </div>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {isOpen && (
                        <div className="vol-admin-apps">
                          {volLoading && <p className="empty-msg">Loading…</p>}
                          {!volLoading && apps.length === 0 && <p className="empty-msg">No applications yet.</p>}
                          {!volLoading &&
                            apps.map((app) => (
                              <div key={app._id} className="vol-admin-app-row">
                                <div className="vol-admin-app-info">
                                  <span className="vol-admin-app-name">{app.userId?.name || 'Unknown'}</span>
                                  <span className="vol-admin-app-email">{app.userId?.email}</span>
                                  <span className="vol-admin-app-date">Applied {fmt(app.createdAt)}</span>
                                </div>
                                <div className="vol-admin-app-actions">
                                  <StatusBadge status={app.status} />
                                  {app.status !== 'approved' && (
                                    <button className="vol-action-btn approve" title="Approve" disabled={actionLoading === app._id} onClick={() => handleVolStatus(ev._id, app._id, 'approved')}>
                                      <Check size={13} />
                                    </button>
                                  )}
                                  {app.status !== 'rejected' && (
                                    <button className="vol-action-btn reject" title="Reject" disabled={actionLoading === app._id} onClick={() => handleVolStatus(ev._id, app._id, 'rejected')}>
                                      <X size={13} />
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
      )}
    </div>
  );
}

export default OrganizerDashboard;
