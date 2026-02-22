import '../css/Calendar.css';
import { useState } from 'react';
import CalendarDateModal from '../components/CalendarDateModal';

const EVENT_DATES = [5, 15, 22, 25];

function Calendar() {
    const [currentMonth] = useState('February 2025');
    const [selectedDate, setSelectedDate] = useState(null);

    const daysInMonth = 28;
    const startDay = 6;

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
        calendarDays.push({ day: null, hasEvent: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push({ day: d, hasEvent: EVENT_DATES.includes(d) });
    }

    const handleDayClick = (item) => {
        if (item.day) setSelectedDate(String(item.day));
    };

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <h1>Academic Calendar</h1>
                <p>{currentMonth}</p>
            </div>
            <div className="calendar-container">
                <div className="calendar-weekdays">
                    {weekDays.map((wd) => (
                        <div key={wd} className="weekday">
                            {wd}
                        </div>
                    ))}
                </div>
                <div className="calendar-grid">
                    {calendarDays.map((item, idx) => (
                        <div
                            key={idx}
                            className={`calendar-day ${item.hasEvent ? 'has-event' : ''} ${item.day ? 'clickable' : 'empty'}`}
                            onClick={() => handleDayClick(item)}
                            role={item.day ? 'button' : undefined}
                            tabIndex={item.day ? 0 : undefined}
                            onKeyDown={(e) => item.day && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleDayClick(item))}
                            aria-label={item.day ? `View events for February ${item.day}` : undefined}
                        >
                            {item.day || ''}
                        </div>
                    ))}
                </div>
                <div className="calendar-legend">
                    <span className="legend-item">
                        <span className="legend-dot has-event"></span> Event scheduled
                    </span>
                </div>
            </div>
            <div className="calendar-events-list">
                <h3>Events This Month</h3>
                <ul>
                    <li><strong>Feb 5</strong> – Career Fair</li>
                    <li><strong>Feb 15</strong> – Cultural Night</li>
                    <li><strong>Feb 22</strong> – Sports Day</li>
                    <li><strong>Feb 25</strong> – Tech Fest 2025</li>
                </ul>
            </div>

            <CalendarDateModal
                selectedDate={selectedDate}
                month="February"
                onClose={() => setSelectedDate(null)}
            />
        </div>
    );
}

export default Calendar;
