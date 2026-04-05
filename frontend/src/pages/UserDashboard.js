import { useState, useEffect, useContext } from 'react';
import '../css/Dashboard.css';
import {API_BASE_URL} from "../config/api.js"
import { Context } from '../context/UserContext.js';
import { QrCode, X, Download, CalendarCheck, Megaphone, FilePen, Send, Check, FileClock } from 'lucide-react';

function QRModal({ qrCode, title, subtitle, onClose }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${title.replace(/\s+/g, '_')}_pass.png`;
    link.click();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal qr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qr-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="qr-modal-header">
          <QrCode size={24} />
          <h2>{subtitle}</h2>
        </div>
        <p className="qr-event-name">{title}</p>
        <div className="qr-image-wrapper">
          <img src={qrCode} alt="QR pass" className="qr-image" />
        </div>
        <p className="qr-instructions">Present this at the entrance to check in.</p>
        <button className="download-btn" onClick={handleDownload}>
          <Download size={15} style={{ marginRight: 6 }} /> Download Pass
        </button>
      </div>
    </div>
  );
}

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
      }}
    >
      {s.label}
    </span>
  );
}

function UserDashboard() {
  const { user } = useContext(Context);
  const name = user?.name || 'Student';
  const role = (user?.role || 'user').toLowerCase();

  const [activeTab, setActiveTab] = useState('overview');

  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);

  const [opportunities, setOpportunities] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [appliedIds, setAppliedIds] = useState({});
  const [loadingVolId, setLoadingVolId] = useState(null);

  const [qrModal, setQrModal] = useState({
    open: false,
    qrCode: null,
    title: '',
    subtitle: '',
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [evRes, notRes, regRes, volAppRes, oppRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/notices`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/events/my/registrations`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/events/my/volunteer-applications`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/events/volunteer/opportunities`, {
            credentials: 'include',
          }),
        ]);

        const [evData, notData, regData, volAppData, oppData] = await Promise.all([evRes.json(), notRes.json(), regRes.json(), volAppRes.json(), oppRes.json()]);

        setEvents(evData.slice(0, 3));
        setNotices(notData.slice(0, 3));
        setMyRegistrations(regData.registrations || []);

        const apps = volAppData.applications || [];
        setMyApplications(apps);
        const map = {};
        apps.forEach((a) => {
          map[String(a.eventId?._id || a.eventId)] = {
            qrCode: a.qrCode,
            status: a.status,
          };
        });
        setAppliedIds(map);

        setOpportunities(Array.isArray(oppData) ? oppData : []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };
    load();
  }, [user]);

  const handleVolunteerApply = async (eventId, eventTitle) => {
    setLoadingVolId(eventId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/volunteer`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      // if (!res.ok) {
      //     if (data.qrCode) {
      //         setAppliedIds((prev) => ({
      //             ...prev,
      //             [eventId]: { qrCode: data.qrCode, status: data.status },
      //         }));
      //         setQrModal({
      //             open: true,
      //             qrCode: data.qrCode,
      //             title: eventTitle,
      //             subtitle: 'Volunteer Pass',
      //         });
      //     }
      //     return;
      // }

      // setOpportunities((prev) =>
      //     prev
      //         .map((e) =>
      //             e._id === eventId
      //                 ? {
      //                       ...e,
      //                       volunteersRemaining: e.volunteersRemaining - 1,
      //                   }
      //                 : e,
      //         )
      //         .filter((e) => e.volunteersRemaining > 0),
      // );

      setAppliedIds((prev) => ({
        ...prev,
        [eventId]: { qrCode: data.qrCode, status: data.status },
      }));
      setMyApplications((prev) => [
        {
          _id: data.applicationId,
          eventId: { _id: eventId, title: eventTitle },
          status: data.status,
          qrCode: data.qrCode,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      // setQrModal({
      //     open: true,
      //     qrCode: data.qrCode,
      //     title: eventTitle,
      //     subtitle: 'Volunteer Pass',
      // });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVolId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const approvedCount = myApplications.filter((a) => a.status === 'approved').length;
  const pendingCount = myApplications.filter((a) => a.status === 'pending').length;

  return (
    <div className="dashboard-page">
      {qrModal.open && (
        <QRModal
          qrCode={qrModal.qrCode}
          title={qrModal.title}
          subtitle={qrModal.subtitle}
          onClose={() =>
            setQrModal({
              open: false,
              qrCode: null,
              title: '',
              subtitle: '',
            })
          }
        />
      )}

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome, {name} !</h1>
          <p className="dashboard-subtitle">Here is what&apos;s happening on campus.</p>
        </div>
        <span className={`role-badge role-${role}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${activeTab === 'volunteer' ? 'active' : ''}`} onClick={() => setActiveTab('volunteer')}>
          Volunteer
          {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <CalendarCheck size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Upcoming Events</p>
                <p className="stat-value">{events.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Megaphone size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Recent Notices</p>
                <p className="stat-value">{notices.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FilePen size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">My Registrations</p>
                <p className="stat-value">{myRegistrations.length}</p>
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
                  events.map((e) => (
                    <li key={e._id}>
                      <strong>{e.title}</strong> — {formatDate(e.date)}
                    </li>
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
              <ul className="section-list">{notices.length > 0 ? notices.map((n) => <li key={n._id}>{n.title}</li>) : <li className="empty-msg">No recent notices.</li>}</ul>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">My Registrations</h2>
              </div>
              {myRegistrations.length > 0 ? (
                <ul className="section-list">
                  {myRegistrations.map((r) => {
                    const ev = r.eventId;
                    const title = ev?.title || 'Event';
                    return (
                      <li key={r._id || ev?._id} className="reg-list-item">
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >
                            {title}
                          </span>
                          {ev?.date && (
                            <span
                              style={{
                                fontSize: 11,
                                color: '#94a3b8',
                              }}
                            >
                              {formatDate(ev.date)}
                            </span>
                          )}
                        </div>
                        {
                          <button
                            className="qr-inline-btn"
                            onClick={() =>
                              setQrModal({
                                open: true,
                                qrCode: r.qrCode,
                                title,
                                subtitle: 'Your Ticket',
                              })
                            }
                          >
                            <QrCode size={14} /> View QR
                          </button>
                        }
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="empty-state">
                  <p>You have not registered for any events yet.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'volunteer' && (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Send size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Applications Sent</p>
                <p className="stat-value">{myApplications.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Check size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Approved</p>
                <p className="stat-value">{approvedCount}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FileClock size={26} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid wide">
            <div className="dashboard-section vol-opportunities">
              <div className="section-header">
                <h2 className="section-title">Open Opportunities</h2>
              </div>
              {opportunities.length === 0 ? (
                <div className="empty-state">
                  <p>No volunteer slots are open right now.</p>
                </div>
              ) : (
                <div className="vol-cards">
                  {opportunities.map((ev) => {
                    const applied = appliedIds[ev._id];
                    const isFull = ev.volunteersRemaining <= 0;
                    return (
                      <div key={ev._id} className="vol-opportunity-card">
                        <div className="vol-opp-info">
                          <strong>{ev.title}</strong>
                          <span className="vol-opp-date">
                            {formatDate(ev.date)} · {ev.location}
                          </span>
                          <span className="vol-slots">{isFull ? 'Full' : `${ev.volunteersRemaining} slot${ev.volunteersRemaining !== 1 ? 's' : ''} left`}</span>
                        </div>
                        {applied ? (
                          <div className="vol-applied-row">
                            <StatusBadge status={applied.status} />
                            {console.log(applied.status)}
                            {applied.status === 'approved' && (
                              <button
                                className="qr-inline-btn"
                                onClick={() =>
                                  setQrModal({
                                    open: true,
                                    qrCode: applied.qrCode,
                                    title: ev.title,
                                    subtitle: 'Volunteer Pass',
                                  })
                                }
                              >
                                <QrCode size={13} /> QR
                              </button>
                            )}
                          </div>
                        ) : (
                          <button className={`vol-apply-btn ${isFull ? 'disabled' : ''}`} disabled={isFull || loadingVolId === ev._id} onClick={() => handleVolunteerApply(ev._id, ev.title)}>
                            {loadingVolId === ev._id ? 'Applying...' : 'Apply'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">My Applications</h2>
              </div>
              {myApplications.length === 0 ? (
                <div className="empty-state">
                  <p>You have not applied for any volunteer roles yet.</p>
                </div>
              ) : (
                <ul className="section-list">
                  {myApplications.map((app) => (
                    <li key={app._id} className="vol-app-item">
                      <div className="vol-app-info">
                        <span className="vol-app-title">{app.eventId?.title || 'Event'}</span>
                        <span className="vol-app-date">{formatDate(app.createdAt)}</span>
                      </div>
                      <div className="vol-app-actions">
                        <StatusBadge status={app.status} />
                        {app.status === 'approved' && (
                          <button
                            className="qr-inline-btn"
                            onClick={() =>
                              setQrModal({
                                open: true,
                                qrCode: app.qrCode,
                                title: app.eventId?.title || 'Event',
                                subtitle: 'Volunteer Pass',
                              })
                            }
                          >
                            <QrCode size={13} /> QR
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;
