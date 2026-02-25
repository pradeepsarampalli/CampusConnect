import '../css/Events.css';
import logo from '../assets/logo.png';
import MapIcon from '../components/MapIcon';
import { useEffect, useState } from 'react';

function Events() {
     useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:3001/api/event/getEvents");
                
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                const data = await response.json();
                setEvents(data)
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }

        fetchData();
    },[]);

    const [events,setEvents] = useState([])
    return (
        <div className="events-page">
            <div className="events-header">
                <h1>Upcoming Events</h1>
                <p>Discover workshops, seminars, and campus activities</p>
            </div>
            <div className="events-grid">
                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-card-image">
                            <img src={logo} alt={event.title} />
                        </div>
                        <div className="event-card-content">
                            <h3>{event.title}</h3>
                            <div className="event-meta">
                                <span className="event-date">{event.date}</span>
                                <span className="event-location">
                                    <MapIcon size={14} />
                                    {event.venue}
                                </span>
                            </div>
                            <p className="event-description">{event.description}</p>
                            <button className="register-btn" type="button">Register</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Events;
