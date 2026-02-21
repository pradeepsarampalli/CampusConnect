import '../css/Volunteer.css';

const opportunities = [
    {
        id: 1,
        role: 'Event Coordinator',
        event: 'Tech Fest 2025',
        description: 'Help organize workshops and manage logistics. Great for students interested in event management.',
    },
    {
        id: 2,
        role: 'Registration Desk Volunteer',
        event: 'Career Fair',
        description: 'Assist with attendee registration and guide visitors. Must be available March 5.',
    },
    {
        id: 3,
        role: 'Stage Crew',
        event: 'Cultural Night',
        description: 'Support setup, lighting, and backstage coordination for performances.',
    },
    {
        id: 4,
        role: 'Sports Coordinator',
        event: 'Sports Day',
        description: 'Help organize matches and assist referees. Prior sports experience preferred.',
    },
    {
        id: 5,
        role: 'Documentation Volunteer',
        event: 'AI Seminar',
        description: 'Take notes and prepare summary reports. Good writing skills required.',
    },
    {
        id: 6,
        role: 'Mentor',
        event: 'Startup Pitch Day',
        description: 'Guide participants with feedback on their business ideas. Open to seniors.',
    },
];

function Volunteer() {
    return (
        <div className="volunteer-page">
            <div className="volunteer-header">
                <h1>Volunteer Opportunities</h1>
                <p>Contribute to campus events and build your skills</p>
            </div>
            <div className="volunteer-grid">
                {opportunities.map((opp) => (
                    <div key={opp.id} className="volunteer-card">
                        <div className="volunteer-card-content">
                            <h3>{opp.role}</h3>
                            <p className="volunteer-event">{opp.event}</p>
                            <p className="volunteer-description">{opp.description}</p>
                            <button className="apply-btn" type="button">Apply</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Volunteer;
