import { useState, useEffect } from 'react';
import '../css/Events.css';
import logo from '../assets/logo.png';
import MapIcon from '../components/MapIcon';
import { Pencil, Trash2 } from "lucide-react";

function Events() {
    const [events, setEvents] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [message, setMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);

    // Format date to human-readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log("Updated data:", editData);
        try{
            const id = editData._id;
        const res = await fetch(`http://localhost:3001/api/events/${id}`,{method:"PUT",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(editData)
        })
        setShowEditModal(false);
        if(res.ok) setEvents(prev=>prev.map(ev=>ev._id ===editData._id?{...editData}:ev));
    }
    catch(err){
        console.log("failed t0 update!")
    }
    };
    const handleEditChange = (e) => {
        const {name,value} = e.target;
        setEditData(prev=>({...prev,[name]:value}));
    };
    const handleEdit = (event) => {
        setEditData({...event,date: event.date?.split("T")[0]});
        setShowEditModal(true);
    };

    const handleDelete = async (eventId) => {
        console.log("Delete event:", eventId);
        try{
            const res = await fetch(`http://localhost:3001/api/events/${eventId}`,{method:"DELETE"})
            if(!res.ok) return;
            setEvents(events=>events.filter(event=>eventId!==event._id))
        }
        catch(err){
            console.log(err)
        }
    };
    // Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/events');
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
                setMessage('Failed to load events');
            }
        };
        fetchEvents();
    }, []);

    // Register for an event
    const handleRegister = async (eventId) => {
        setLoadingId(eventId);
        setMessage('');
        try {
            // const res = await fetch(`http://localhost:3001/api/events/${eventId}/register`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ userId }),
            // });
            // const data = await res.json();
            // if (!res.ok) {
            //     setMessage(data.message || 'Registration failed');
            //     return;
            // }
            // Update seats in frontend
            setEvents(prev =>
                prev.map(e => e._id===eventId||e.id === eventId?{...e,seatsRemaining: e.seatsRemaining-1}: e)
            );
            setMessage('Registered successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Registration failed');
        } finally {
            setLoadingId(null);
        }
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
                            <textarea name="description" value={editData.description} onChange={handleEditChange}  required/>
                            <input  type="text" name="location" value={editData.location} onChange={handleEditChange} required/>
                            <input type="date" name="date" value={editData.date} onChange={handleEditChange} required />
                            <input type="number" name="capacity" value={editData.capacity} onChange={handleEditChange} required/>
                            <div className="modal-actions">
                                <button type="submit" className="primary-btn">Update</button>
                                <button type="button"className="secondary-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="events-grid">
                {events.map((event) => {
                    const isFull = event.seatsRemaining<=0;
                    const progress = event.seatsRemaining /event.capacity;
                    return (
                        <div key={event._id || event.id} className="event-card">
                            <div className="event-card-image">
                                <img src={logo} alt={event.title} />
                            </div>
                            <div className="event-card-content">
                                <h3>{event.title}</h3>
                                <div className="event-meta">
                                    <span className="event-date">{formatDate(event.date)}</span>
                                    <span className="event-location">
                                        <MapIcon size={14} />
                                        {event.location}
                                    </span>
                                </div>
                                <p className="event-description">{event.description}</p>
                                <div className="event-actions">
                                    <button
                                        className="icon-btn edit-btn"
                                        onClick={() => handleEdit(event)}
                                        type="button"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => handleDelete(event._id || event.id)}
                                        type="button"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <button
                                    className={`register-btn ${isFull ? 'full' : ''}`}
                                    type="button"
                                    disabled={isFull || loadingId === (event._id || event.id)}
                                    style={{ '--progress': progress }}
                                    onClick={() => handleRegister(event._id || event.id)}
                                >
                                    {isFull
                                        ? 'Full'
                                        : loadingId === (event._id || event.id)
                                            ? 'Registering...'
                                            :`Register (${event.seatsRemaining} left)`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Events;