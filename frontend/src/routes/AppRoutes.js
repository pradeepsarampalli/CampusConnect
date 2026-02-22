import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Layout from '../components/Layout';
import Events from '../pages/Events';
import Volunteer from '../pages/Volunteer';
import Notices from '../pages/Notices';
import AboutUs from '../pages/AboutUs';
import Calendar from '../pages/Calendar';
import Settings from '../pages/Settings';
import Support from '../pages/Support';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="events" element={<Events />} />
                    <Route path="volunteer" element={<Volunteer />} />
                    <Route path="notices" element={<Notices />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="support" element={<Support />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
