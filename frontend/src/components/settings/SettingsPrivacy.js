import { useState } from 'react';

function SettingsPrivacy() {
    const [visibility, setVisibility] = useState('all');
    const [dataSharing, setDataSharing] = useState(false);

    return (
        <div className="settings-expand-content">
            <div className="settings-field">
                <label htmlFor="profile-visibility">Profile visibility</label>
                <select
                    id="profile-visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="settings-select"
                >
                    <option value="all">Everyone</option>
                    <option value="students">Students only</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div className="settings-toggle-row">
                <label>Data sharing</label>
                <button
                    type="button"
                    role="switch"
                    aria-checked={dataSharing}
                    aria-label="Toggle data sharing"
                    className={`settings-toggle ${dataSharing ? 'on' : ''}`}
                    onClick={() => setDataSharing(!dataSharing)}
                >
                    <span className="settings-toggle-slider" />
                </button>
            </div>
        </div>
    );
}

export default SettingsPrivacy;
