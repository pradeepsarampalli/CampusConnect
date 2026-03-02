import { useEffect, useMemo, useState } from 'react';
import '../css/Notices.css';

function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function Notices() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | pinned

    useEffect(() => {
        let isMounted = true;

        async function loadNotices() {
            try {
                const res = await fetch('/api/notices');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to load notices');
                }

                if (!isMounted) return;

                const sorted = [...data].sort((a, b) => {
                    const aPinned = !!a.pinned;
                    const bPinned = !!b.pinned;
                    if (aPinned !== bPinned) {
                        return aPinned ? -1 : 1;
                    }
                    const aDate = new Date(a.createdAt || 0).getTime();
                    const bDate = new Date(b.createdAt || 0).getTime();
                    return bDate - aDate;
                });

                setNotices(sorted);
                setLoading(false);
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || 'Failed to load notices');
                setLoading(false);
            }
        }

        loadNotices();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredNotices = useMemo(() => {
        return notices.filter((notice) => {
            if (filter === 'pinned' && !notice.pinned) return false;
            if (!search.trim()) return true;
            const text = `${notice.title || ''} ${notice.body || ''}`.toLowerCase();
            return text.includes(search.toLowerCase());
        });
    }, [notices, search, filter]);

    return (
        <div className="notices-page">
            <div className="notices-header">
                <h1>College Notices</h1>
                <p>Important announcements and updates</p>
            </div>

            <div className="notices-controls">
                <input
                    type="text"
                    className="notices-search"
                    placeholder="Search notices"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="notices-filters">
                    <button
                        type="button"
                        className={`notices-filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`notices-filter-btn ${filter === 'pinned' ? 'active' : ''}`}
                        onClick={() => setFilter('pinned')}
                    >
                        Pinned
                    </button>
                </div>
            </div>

            {error && !loading && <p className="notices-status error">{error}</p>}

            {loading && (
                <div className="notices-grid">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="notice-card skeleton">
                            <div className="skeleton-line short" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line" />
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && filteredNotices.length === 0 && (
                <div className="notices-empty">No notices available.</div>
            )}

            {!loading && !error && filteredNotices.length > 0 && (
                <div className="notices-grid">
                    {filteredNotices.map((notice) => (
                        <div
                            key={notice._id || notice.id}
                            className={`notice-card ${notice.pinned ? 'pinned' : ''}`}
                        >
                            {notice.pinned && <span className="notice-badge">Pinned</span>}
                            <div className="notice-date">
                                {formatDate(notice.createdAt)}
                            </div>
                            <h3>{notice.title}</h3>
                            <p>{notice.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notices;
