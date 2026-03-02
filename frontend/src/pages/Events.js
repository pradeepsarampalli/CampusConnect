import { useState, useEffect } from 'react';
import '../css/Events.css';
import logo from '../assets/logo.png';
import MapIcon from '../components/MapIcon';

function Events() {
    const [events, setEvents] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [message, setMessage] = useState('');

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
            const userId = "69a320a7cfa4c0bb7c7ca025"; // Test Mongo _id

            const res = await fetch(`http://localhost:3001/api/events/${eventId}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || 'Registration failed');
                return;
            }

            // Update seats in frontend
            setEvents(prev =>
                prev.map(e =>
                    e._id === eventId || e.id === eventId
                        ? { ...e, seatsRemaining: e.seatsRemaining - 1 }
                        : e
                )
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
            <div className="events-grid">
                {events.map((event) => {
                    const isFull = event.seatsRemaining <= 0;
                    const progress = event.seatsRemaining / event.capacity;

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
                                        : `Register (${event.seatsRemaining} left)`} 
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