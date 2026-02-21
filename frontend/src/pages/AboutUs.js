import '../css/AboutUs.css';

function AboutUs() {
    return (
        <div className="about-page">
            <div className="about-header">
                <h1>About CampusConnect</h1>
                <p>Your centralized student platform</p>
            </div>
            <section className="about-section">
                <h2>What is CampusConnect?</h2>
                <p>
                    CampusConnect is a centralized student platform designed to improve campus communication and keep 
                    students informed. Built for students by students, it brings events, notices, volunteer opportunities, 
                    and more to one place.
                </p>
            </section>
            <section className="about-section">
                <h2>Features</h2>
                <ul className="highlights-list">
                    <li>Events – Discover workshops, seminars, and campus activities</li>
                    <li>Notices – Important announcements and updates in one place</li>
                    <li>Volunteer – Register for volunteer roles and contribute to campus events</li>
                    <li>Interactive Calendar – View event schedules and dates at a glance</li>
                </ul>
            </section>
            <section className="about-section">
                <h2>Our Goal</h2>
                <p>
                    Our goal is to improve campus communication and make it easier for students to stay connected 
                    with what matters—whether that is the next big event, a new volunteer opportunity, or an important 
                    college notice.
                </p>
            </section>
            <section className="about-section">
                <h2>Built for Students</h2>
                <p>
                    CampusConnect is built for students by students. We understand the challenges of staying updated 
                    in a busy campus environment and have designed this platform to simplify that experience.
                </p>
            </section>
        </div>
    );
}

export default AboutUs;
