import { useState, useEffect, useContext } from 'react';
import '../css/Events.css';
import logo from '../assets/logo.png';
import { Pencil, Trash2, QrCode, X, Download } from 'lucide-react';
import { Context } from '../context/UserContext';

function Events() {
    const { user } = useContext(Context);
    const [events, setEvents] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [message, setMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [qrModal, setQrModal] = useState({ open: false, qrCode: null, eventTitle: '' });
    const [myRegistrations, setMyRegistrations] = useState({});


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true,
        }).format(date);
    };

    const closeQR = () => setQrModal({ open: false, qrCode: null, eventTitle: '' });


    useEffect(() => {
        if (!user) return;
        const fetchMyRegistrations = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/events/my/registrations', {
                    credentials: 'include'
                });
                if (!res.ok) return;
                const data = await res.json();
                const map = {};
                data.registrations.forEach(r => {
                    const key = r.eventId?._id ? String(r.eventId._id) : String(r.eventId);
                    map[key] = r.qrCode;
                });
                setMyRegistrations(map);
            } catch (err) {
                console.error('Failed to load registrations:', err);
            }
        };
        fetchMyRegistrations();
    }, [user]);


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/events', { credentials: 'include' });
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
                setMessage('Failed to load events');
            }
        };
        fetchEvents();
    }, []);


    const handleRegister = async (eventId, eventTitle) => {
        if (!user) {
            setMessage('Please sign in to register for events.');
            return;
        }
        setLoadingId(eventId);
        setMessage('');
        try {
            const res = await fetch(`http://localhost:3001/api/events/${eventId}/register`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.qrCode) {
                    setMyRegistrations(prev => ({ ...prev, [eventId]: data.qrCode }));
                    setQrModal({ open: true, qrCode: data.qrCode, eventTitle });
                } else {
                    setMessage(data.message || 'Registration failed.');
                }
                return;
            }

            setEvents(prev =>
                prev.map(e =>(e._id === eventId || e.id === eventId)? { ...e, seatsRemaining: e.seatsRemaining - 1 }: e)
            );

            setMyRegistrations(prev => ({ ...prev, [eventId]: data.qrCode }));
            setQrModal({ open: true, qrCode: data.qrCode, eventTitle });

        } catch (err) {
            console.error(err);
            setMessage('Registration failed.');
        } finally {
            setLoadingId(null);
        }
    };


    const handleViewQR = (eventId, eventTitle) => {
        const qrCode = myRegistrations[eventId];
        if (qrCode) setQrModal({ open: true, qrCode, eventTitle });
    };


    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.href = qrModal.qrCode;
        link.download = `${qrModal.eventTitle.replace(/\s+/g, '_')}_EventPass.png`;
        link.click();
    };


    const handleEdit = (event) => {
        setEditData({ ...event, date: event.date?.split('T')[0] });
        setShowEditModal(true);
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3001/api/events/${editData._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            setShowEditModal(false);
            if (res.ok) setEvents(prev => prev.map(ev => ev._id === editData._id ? { ...editData } : ev));
        } catch (err) {
            console.error('Failed to update event', err);
        }
    };

    const handleDelete = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:3001/api/events/${eventId}`, {
                method: 'DELETE', credentials: 'include'
            });
            if (res.ok) setEvents(events => events.filter(e => e._id !== eventId));
        } catch (err) { console.error(err); }
    };


    return (
        <div className="events-page">
            <div className="events-header">
                <h1>Upcoming Events</h1>
                <p>Discover workshops, seminars, and campus activities</p>
            </div>

            {message && <p className="events-status">{message}</p>}

            {showEditModal && editData && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Event</h2>
                        <form onSubmit={handleEditSubmit} className="modal-form">
                            <input type="text" name="title" value={editData.title} onChange={handleEditChange} required />
                            <textarea name="description" value={editData.description} onChange={handleEditChange} required />
                            <input type="text" name="location" value={editData.location} onChange={handleEditChange} required />
                            <input type="date" name="date" value={editData.date} onChange={handleEditChange} required />
                            <input type="number" name="capacity" value={editData.capacity} onChange={handleEditChange} required />
                            <div className="modal-actions">
                                <button type="submit" className="primary-btn">Update</button>
                                <button type="button" className="secondary-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {qrModal.open && (
                <div className="modal-overlay" onClick={closeQR}>
                    <div className="modal qr-modal" onClick={e => e.stopPropagation()}>
                        <button className="qr-close-btn" onClick={closeQR} aria-label="Close">
                            <X size={20} />
                        </button>
                        <div className="qr-modal-header">
                            <QrCode size={26} />
                            <h2>Your Event Pass</h2>
                        </div>
                        <p className="qr-event-name">{qrModal.eventTitle}</p>
                        <div className="qr-image-wrapper">
                            <img src={qrModal.qrCode} alt="QR Code for event entry" className="qr-image" />
                        </div>
                        <p className="qr-instructions">
                            Present this QR code at the entrance to check&nbsp;in.
                        </p>
                        <button className="download-btn" onClick={handleDownloadQR}>
                            <Download size={16} style={{ marginRight: 6 }} />
                            Download Pass
                        </button>
                    </div>
                </div>
            )}

            <div className="events-grid">
                {events.map((event) => {
                    const id = event._id || event.id;
                    const isFull = event.seatsRemaining <= 0;
                    const registered = Boolean(myRegistrations[id]);
                    const progress = event.seatsRemaining / event.capacity;

                    return (
                        <div key={id} className="event-card">
                            <div className="event-card-image">
                                <img src={logo} alt={event.title} />
                            </div>
                            <div className="event-card-content">
                                <h3>{event.title}</h3>
                                <div className="event-meta">
                                    <span className="event-date">{formatDate(event.date)}</span>
                                    <span className="event-location">{event.location}</span>
                                </div>
                                <p className="event-description">{event.description}</p>
                                {user?.role === 'admin' && (
                                    <div className="event-actions">
                                        <button className="icon-btn edit-btn" onClick={() => handleEdit(event)} type="button"><Pencil size={16} /></button>
                                        <button className="icon-btn delete-btn" onClick={() => handleDelete(id)} type="button"><Trash2 size={16} /></button>
                                    </div>
                                )}
                                {registered ? (
                                    <button
                                        className="register-btn registered"
                                        type="button"
                                        onClick={() => handleViewQR(id, event.title)}
                                    >
                                        <QrCode size={15} style={{ marginRight: 6 }} />
                                        View My QR
                                    </button>
                                ) : (
                                    <button
                                        className={`register-btn ${isFull ? 'full' : ''}`}
                                        type="button"
                                        disabled={isFull || loadingId === id}
                                        style={{ '--progress': progress }}
                                        onClick={() => handleRegister(id, event.title)}
                                    >
                                        {isFull
                                            ? 'Full'
                                            : loadingId === id
                                                ? 'Registering...'
                                                : `Register (${event.seatsRemaining} left)`}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Events;
