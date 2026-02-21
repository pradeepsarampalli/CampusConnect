import { useState } from 'react';
import '../css/Settings.css';
import SettingsCard from '../components/settings/SettingsCard';
import SettingsProfile from '../components/settings/SettingsProfile';
import SettingsNotifications from '../components/settings/SettingsNotifications';
import SettingsPrivacy from '../components/settings/SettingsPrivacy';

function Settings() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account preferences</p>
            </div>
            <div className="settings-sections">
                <SettingsCard
                    title="Profile"
                    description="Update your name, email, and profile picture."
                    isOpen={openSection === 'profile'}
                    onClick={() => toggleSection('profile')}
                >
                    <SettingsProfile />
                </SettingsCard>
                <SettingsCard
                    title="Notifications"
                    description="Choose how you receive event and notice alerts."
                    isOpen={openSection === 'notifications'}
                    onClick={() => toggleSection('notifications')}
                >
                    <SettingsNotifications />
                </SettingsCard>
                <SettingsCard
                    title="Privacy"
                    description="Control your visibility and data sharing preferences."
                    isOpen={openSection === 'privacy'}
                    onClick={() => toggleSection('privacy')}
                >
                    <SettingsPrivacy />
                </SettingsCard>
            </div>
        </div>
    );
}

export default Settings;
