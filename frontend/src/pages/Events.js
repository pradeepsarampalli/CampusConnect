import '../css/Events.css';
import logo from '../assets/logo.png';
import MapIcon from '../components/MapIcon';

const events = [
    {
        id: 1,
        title: 'Tech Fest 2025',
        date: 'Feb 25, 2025',
        location: 'Main Auditorium',
        description: 'Annual technology festival featuring workshops, hackathons, and guest speakers from the industry.',
    },
    {
        id: 2,
        title: 'Career Fair',
        date: 'Mar 5, 2025',
        location: 'College Grounds',
        description: 'Connect with top recruiters and explore internship opportunities. Bring your resume.',
    },
    {
        id: 3,
        title: 'Cultural Night',
        date: 'Mar 15, 2025',
        location: 'Open Air Theatre',
        description: 'An evening of music, dance, and performances showcasing diverse talents from across campus.',
    },
    {
        id: 4,
        title: 'Sports Day',
        date: 'Mar 22, 2025',
        location: 'Sports Complex',
        description: 'Inter-department athletics competition. Register for your favorite sport.',
    },
    {
        id: 5,
        title: 'Seminar: AI in Education',
        date: 'Apr 2, 2025',
        location: 'Seminar Hall',
        description: 'Expert talk on artificial intelligence applications in modern education.',
    },
    {
        id: 6,
        title: 'Startup Pitch Day',
        date: 'Apr 10, 2025',
        location: 'Incubation Center',
        description: 'Students present their startup ideas to investors and mentors.',
    },
];

function Events() {
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
                                    {event.location}
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
