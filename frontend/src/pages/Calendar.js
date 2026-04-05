import { useState, useEffect, useCallback } from 'react';
import {API_BASE_URL} from "../config/api.js"
import '../css/Calendar.css';

function CalendarDateModal({ selectedDate, month, events = [], onClose }) {
  const day = selectedDate ? parseInt(selectedDate, 10) : null;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
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
                <li key={event._id} className="calendar-modal-event">
                  <div className="modal-event-title">{event.title}</div>
                  <div className="modal-event-time">{event.time}</div>
                  <div className="modal-event-location">
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

function Calendar() {
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setEvents(data || []))
      .catch(console.error);
  }, []);

  const currentMonth = new Date(year, month).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const filteredEvents = events.filter((ev) => {
    const d = new Date(ev.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const eventDays = filteredEvents.map((ev) => new Date(ev.date).getDate());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ day: null, hasEvent: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, hasEvent: eventDays.includes(d) });
  }

  const handleDayClick = (item) => {
    if (item.day) setSelectedDate(String(item.day));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePrevMonth = () => setMonth((prev) => (prev === 0 ? 11 : prev - 1));
  const handleNextMonth = () => setMonth((prev) => (prev === 11 ? 0 : prev + 1));

  const selectedDayEvents = selectedDate ? filteredEvents.filter((ev) => new Date(ev.date).getDate() === parseInt(selectedDate, 10)) : [];

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Academic Calendar</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={handlePrevMonth}>◀</button>
          <p>{currentMonth}</p>
          <button onClick={handleNextMonth}>▶</button>
        </div>
      </div>

      <div className="calendar-parent-container">
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
              <div key={idx} className={`calendar-day ${item.hasEvent ? 'has-event' : ''} ${item.day ? 'clickable' : 'empty'}`} onClick={() => handleDayClick(item)}>
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
          {filteredEvents.length === 0 ? (
            <p>No events this month</p>
          ) : (
            <ul>
              {filteredEvents.map((ev) => (
                <li key={ev._id}>
                  <strong>{formatDate(ev.date)}</strong> – {ev.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CalendarDateModal selectedDate={selectedDate} month={currentMonth} events={selectedDayEvents} onClose={() => setSelectedDate(null)} />
    </div>
  );
}

export default Calendar;
