import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/Dashboard.css';
import location from '../assets/location.png';

function Layout() {
    const [width, setWidth] = useState(window.innerWidth);
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMapClick = () => {
        window.open('https://www.google.com/maps/search/CVR+College+of+Engineering', '_blank');
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        if (path === '/support') return location.pathname === '/support';
        return location.pathname.startsWith(path);
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
                                <Link to="/" onClick={() => width < 800 && setOpen(false)}>
                                    <button className={location.pathname === '/' ? 'active' : ''}>Dashboard</button>
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
                        <img src={location} alt="location" />
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
