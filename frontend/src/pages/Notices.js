import '../css/Notices.css';

const notices = [
    {
        id: 1,
        title: 'Holiday Notice – College Closed',
        date: 'Feb 20, 2025',
        summary: 'Due to scheduled maintenance and scholarship discussions, the college will remain closed this Saturday.',
    },
    {
        id: 2,
        title: 'Timetable Update – 3rd Saturday',
        date: 'Feb 18, 2025',
        summary: 'The third Saturday will follow Friday timetable. All classes will be conducted as per the revised schedule.',
    },
    {
        id: 3,
        title: 'Exam Schedule Released',
        date: 'Feb 15, 2025',
        summary: 'Mid-semester examination schedule is now available on the student portal. Check your hall tickets.',
    },
    {
        id: 4,
        title: 'Library Extended Hours',
        date: 'Feb 12, 2025',
        summary: 'Library will remain open until 10 PM during exam preparation week. Valid ID required.',
    },
    {
        id: 5,
        title: 'Fee Payment Deadline',
        date: 'Feb 10, 2025',
        summary: 'Last date for fee payment is Feb 28. Please complete payment to avoid late charges.',
    },
    {
        id: 6,
        title: 'Placement Training Session',
        date: 'Feb 8, 2025',
        summary: 'Aptitude and interview preparation workshop for final year students. Registration open.',
    },
];

function Notices() {
    return (
        <div className="notices-page">
            <div className="notices-header">
                <h1>College Notices</h1>
                <p>Important announcements and updates</p>
            </div>
            <div className="notices-grid">
                {notices.map((notice) => (
                    <div key={notice.id} className="notice-card">
                        <div className="notice-date">{notice.date}</div>
                        <h3>{notice.title}</h3>
                        <p>{notice.summary}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notices;
