import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Layout from '../components/Layout';
import Events from '../pages/Events';
import Notices from '../pages/Notices';
import AboutUs from '../pages/AboutUs';
import Calendar from '../pages/Calendar';
import Settings from '../pages/Settings';
import Support from '../pages/Support';
import AdminDashboard from '../pages/AdminDashboard';
import OrganizerDashboard from '../pages/OrganizerDashboard';
import UserDashboard from '../pages/UserDashboard';
import { Context } from '../context/UserContext';
import { useContext } from 'react';

function DashboardRedirect() {
    const { user, loading } = useContext(Context);
    if (loading) return null;
    if (!user) return <Navigate to="/signin" replace />;
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'organizer') return <Navigate to="/dashboard/organizer" replace />;
    return <Navigate to="/dashboard/user" replace />;
}

function RoleGuard({ allowedRoles, children }) {
    const { user, loading } = useContext(Context);
    if (loading) return null;
    if (!user) return <Navigate to="/signin" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
    return children;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<DashboardRedirect />} />
                    <Route path="dashboard" element={<DashboardRedirect />} />
                    <Route
                        path="dashboard/admin"
                        element={
                            <RoleGuard allowedRoles={['admin']}>
                                <AdminDashboard />
                            </RoleGuard>
                        }
                    />
                    <Route
                        path="dashboard/organizer"
                        element={
                            <RoleGuard allowedRoles={['organizer', 'admin']}>
                                <OrganizerDashboard />
                            </RoleGuard>
                        }
                    />
                    <Route
                        path="dashboard/user"
                        element={
                            <RoleGuard allowedRoles={['user', 'organizer', 'admin']}>
                                <UserDashboard />
                            </RoleGuard>
                        }
                    />
                    <Route path="events" element={<Events />} />
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
