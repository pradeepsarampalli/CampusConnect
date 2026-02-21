import { useCallback, useEffect } from 'react';
import MapIcon from './MapIcon';
import { CALENDAR_EVENTS } from '../data/calendarEvents';
import '../css/Calendar.css';

function CalendarDateModal({ selectedDate, month, onClose }) {
    const day = selectedDate ? parseInt(selectedDate, 10) : null;
    const events = day && CALENDAR_EVENTS[day] ? CALENDAR_EVENTS[day] : [];

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!selectedDate) return null;

    const dateLabel = `${month} ${day}`;

    return (
        <div className="calendar-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Events for ${dateLabel}`}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                <div className="calendar-modal-header">
                    <h3>Events for {dateLabel}</h3>
                    <button type="button" className="calendar-modal-close" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>
                <div className="calendar-modal-content">
                    {events.length === 0 ? (
                        <p className="calendar-modal-empty">No events scheduled for today.</p>
                    ) : (
                        <ul className="calendar-modal-events">
                            {events.map((event) => (
                                <li key={event.id} className="calendar-modal-event">
                                    <div className="modal-event-title">{event.title}</div>
                                    <div className="modal-event-time">{event.time}</div>
                                    <div className="modal-event-location">
                                        <MapIcon size={14} />
                                        <span>{event.location}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalendarDateModal;
