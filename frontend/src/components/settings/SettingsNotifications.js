import { useState } from 'react';

function SettingsNotifications() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [eventReminders, setEventReminders] = useState(true);

    return (
        <div className="settings-expand-content">
            <div className="settings-toggle-row">
                <label htmlFor="email-notif">Email notifications</label>
                <button
                    type="button"
                    role="switch"
                    aria-checked={emailNotif}
                    aria-label="Toggle email notifications"
                    className={`settings-toggle ${emailNotif ? 'on' : ''}`}
                    onClick={() => setEmailNotif(!emailNotif)}
                >
                    <span className="settings-toggle-slider" />
                </button>
            </div>
            <div className="settings-toggle-row">
                <label htmlFor="event-reminders">Event reminders</label>
                <button
                    type="button"
                    role="switch"
                    aria-checked={eventReminders}
                    aria-label="Toggle event reminders"
                    className={`settings-toggle ${eventReminders ? 'on' : ''}`}
                    onClick={() => setEventReminders(!eventReminders)}
                >
                    <span className="settings-toggle-slider" />
                </button>
            </div>
        </div>
    );
}

export default SettingsNotifications;
