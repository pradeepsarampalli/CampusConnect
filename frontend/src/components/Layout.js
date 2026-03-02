import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import locationIcon from '../assets/location.png';
import { getCurrentUser, clearCurrentUser } from '../utils/auth';

function Layout() {
    const [width, setWidth] = useState(window.innerWidth);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifLoading, setNotifLoading] = useState(false);
    const [notifItems, setNotifItems] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const user = getCurrentUser();

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadNotices() {
            try {
                setNotifLoading(true);
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
                setNotifItems(sorted);

                try {
                    const raw = window.localStorage.getItem('user:readNotices');
                    const readIds = raw ? JSON.parse(raw) : [];
                    const unread = sorted.filter((n) => !readIds.includes(n._id)).length;
                    setUnreadCount(unread);
                } catch {
                    setUnreadCount(sorted.length);
                }
            } catch {
                if (!isMounted) return;
            } finally {
                if (isMounted) {
                    setNotifLoading(false);
                }
            }
        }

        loadNotices();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleMapClick = () => {
        window.open('https://www.google.com/maps/search/CVR+College+of+Engineering', '_blank');
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        if (path === '/support') return location.pathname === '/support';
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        clearCurrentUser();
        setProfileOpen(false);
        setNotifOpen(false);
        navigate('/signin', { replace: true });
    };

    const handleToggleNotifications = () => {
        const next = !notifOpen;
        setNotifOpen(next);
        if (next && notifItems.length > 0) {
            try {
                const allIds = notifItems.map((n) => n._id).filter(Boolean);
                window.localStorage.setItem('user:readNotices', JSON.stringify(allIds));
                setUnreadCount(0);
            } catch {
                // ignore
            }
        }
    };

    return (
        <div className="container">
            <div className="layout">
                <div className={`side-bar ${open ? 'open' : ''}`}>
                    {width >= 800 && (
                        <div className="logo">
                            <Link to="/">CampusConnect</Link>
                        </div>
                    )}
                    <div className="options">
                        <ul>
                            <li>
                                <Link to="/dashboard" onClick={() => width < 800 && setOpen(false)}>
                                    <button className={location.pathname.startsWith('/dashboard') ? 'active' : ''}>Dashboard</button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" onClick={() => setOpen(false)}>
                                    <button className={isActive('/events') ? 'active' : ''}>Events</button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/volunteer" onClick={() => setOpen(false)}>
                                    <button className={isActive('/volunteer') ? 'active' : ''}>Volunteer</button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/notices" onClick={() => setOpen(false)}>
                                    <button className={isActive('/notices') ? 'active' : ''}>Notices</button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" onClick={() => setOpen(false)}>
                                    <button className={isActive('/settings') ? 'active' : ''}>Settings</button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="college-info" onClick={handleMapClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleMapClick()} title="View on Google Maps">
                        <img src={locationIcon} alt="location" />
                        <p>CVR College of Engineering</p>
                    </div>
                </div>
                <div className="header">
                    <div className="header-left">
                        {width < 800 ? (
                            <button className="menu-btn" onClick={() => setOpen(!open)}>☰</button>
                        ) : (
                            <ul>
                                <li><Link to="/events"><button>Events</button></Link></li>
                                <li><Link to="/notices"><button>Notices</button></Link></li>
                                <li><Link to="/support"><button>Support</button></Link></li>
                            </ul>
                        )}
                    </div>
                    <div className="header-center">
                        <h2 className="header-title">CampusConnect</h2>
                    </div>
                    <div className="header-right">
                        <ul>
                            <li><Link to="/about-us"><button>About Us</button></Link></li>
                            <li><Link to="/calendar"><button>Calendar</button></Link></li>
                            <li><Link to="/signup"><button>Sign Up</button></Link></li>
                        </ul>
                        <div className="header-actions">
                            <div className="notification-menu">
                                <button
                                    type="button"
                                    className="notification-bell"
                                    onClick={handleToggleNotifications}
                                    aria-haspopup="true"
                                    aria-expanded={notifOpen}
                                >
                                    <span className="bell-icon">🔔</span>
                                    {unreadCount > 0 && (
                                        <span className="notification-badge">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                {notifOpen && (
                                    <div className="notification-dropdown">
                                        <div className="notification-header">Notifications</div>
                                        {notifLoading && <div className="notification-empty">Loading...</div>}
                                        {!notifLoading && notifItems.slice(0, 3).map((n) => (
                                            <button
                                                type="button"
                                                key={n._id}
                                                className="notification-item"
                                                onClick={() => {
                                                    setNotifOpen(false);
                                                    navigate('/notices');
                                                }}
                                            >
                                                <div className="notification-title">{n.title}</div>
                                                <div className="notification-body">
                                                    {(n.body || '').slice(0, 60)}
                                                    {n.body && n.body.length > 60 ? '…' : ''}
                                                </div>
                                            </button>
                                        ))}
                                        {!notifLoading && notifItems.length === 0 && (
                                            <div className="notification-empty">No notices available.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {user && (
                                <div className="profile-menu">
                                    <button
                                        type="button"
                                        className="profile-avatar"
                                        onClick={() => setProfileOpen((prev) => !prev)}
                                        aria-haspopup="true"
                                        aria-expanded={profileOpen}
                                    >
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.name || "Profile"} />
                                        ) : (
                                            (user.name || "U").charAt(0).toUpperCase()
                                        )}
                                    </button>
                                    {profileOpen && (
                                        <div className="profile-dropdown">
                                            <div className="profile-info">
                                                <div className="profile-name">{user.name}</div>
                                                <div className="profile-role">{user.role}</div>
                                            </div>
                                            <button
                                                type="button"
                                                className="profile-action"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    navigate('/settings');
                                                }}
                                            >
                                                Profile
                                            </button>
                                            <button
                                                type="button"
                                                className="profile-action"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="main">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
