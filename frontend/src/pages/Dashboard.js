import { Link } from 'react-router-dom';
import '../css/Dashboard.css';
import logo from '../assets/logo.png';

function Dashboard() {
    return (
        <>
            <div className="welcome-msg">
                <h3>Welcome to CampusConnect!</h3>
                <p>Stay updated with events, notices, and campus activities.</p>
            </div>
            <div className="summary">
                <Link to="/events" className="summary-link">
                    <div className="s1">
                        <p>Events</p>
                        <p>View All</p>
                        <p>Workshops & activities</p>
                    </div>
                </Link>
                <Link to="/volunteer" className="summary-link">
                    <div className="s2">
                        <p>Volunteer</p>
                        <p>Join Us</p>
                        <p>Contribute to campus</p>
                    </div>
                </Link>
                <Link to="/notices" className="summary-link">
                    <div className="s3">
                        <p>Notices</p>
                        <p>Read</p>
                        <p>Latest announcements</p>
                    </div>
                </Link>
                <Link to="/calendar" className="summary-link">
                    <div className="s4">
                        <p>Calendar</p>
                        <p>Check</p>
                        <p>Event schedule</p>
                    </div>
                </Link>
                <Link to="/about-us" className="summary-link">
                    <div className="s5">
                        <p>About</p>
                        <p>Learn More</p>
                        <p>College info</p>
                    </div>
                </Link>
            </div>
            <div className="upcoming">
                <div id="title">Upcoming Events</div>
                <div className="e1">
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                        <p>Tech Fest 2025</p>
                        <p>Mon, Feb 25 | Main Auditorium</p>
                        <p>120/200 Registered</p>
                    </div>
                </div>
                <div className="e2">
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                        <p>Career Fair</p>
                        <p>Wed, Mar 5 | College Grounds</p>
                        <p>85/150 Registered</p>
                    </div>
                </div>
            </div>

            <div className="notices">
                <div id="title">Recent Notices</div>
                <div className="n1">
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                        <p>Holiday Notice – College Closed</p>
                        <p>Due to scheduled maintenance, college will remain closed this Saturday.</p>
                    </div>
                </div>
                <div className="n2">
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                        <p>Timetable Update – 3rd Saturday</p>
                        <p>The third Saturday will follow Friday timetable as per revised schedule.</p>
                    </div>
                </div>
                <div className="n3">
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                        <p>Exam Schedule Released</p>
                        <p>Mid-semester examination schedule is now available on the student portal.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
