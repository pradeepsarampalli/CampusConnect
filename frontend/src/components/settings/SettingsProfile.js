import { useState } from 'react';

function SettingsProfile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Frontend only - preview could be added here
        }
    };

    return (
        <form className="settings-expand-content" onSubmit={handleSave}>
            <div className="settings-field">
                <label htmlFor="profile-name">Name</label>
                <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />
            </div>
            <div className="settings-field">
                <label htmlFor="profile-email">Email</label>
                <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                />
            </div>
            <div className="settings-field">
                <label>Profile Picture</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="settings-file-input"
                />
            </div>
            <button type="submit" className="settings-save-btn">
                {saved ? 'Saved!' : 'Save'}
            </button>
        </form>
    );
}

export default SettingsProfile;
