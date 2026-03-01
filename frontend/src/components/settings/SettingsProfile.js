import { useEffect, useState } from 'react';
import { getCurrentUser, setCurrentUser } from '../../utils/auth';

function SettingsProfile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAvatarUrl(user.avatarUrl || '');
        }
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSaved(false);

        const user = getCurrentUser();
        if (!user) {
            setError('You need to be logged in to update your profile.');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    name,
                    avatarUrl,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to update profile');
                return;
            }

            const updatedUser = {
                ...user,
                name: data.name,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
            };
            setCurrentUser(updatedUser);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
            setError('Failed to update profile');
        } finally {
            setSaving(false);
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
                    readOnly
                    placeholder="your@email.com"
                />
            </div>
            <div className="settings-field">
                <label htmlFor="profile-avatar">Avatar URL</label>
                <input
                    id="profile-avatar"
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                />
            </div>
            {error && <p className="settings-error">{error}</p>}
            <button type="submit" className="settings-save-btn">
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
            </button>
        </form>
    );
}

export default SettingsProfile;
