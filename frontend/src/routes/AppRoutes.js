import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Layout from '../components/Layout';
import Events from '../pages/Events';
import Volunteer from '../pages/Volunteer';
import Notices from '../pages/Notices';
import AboutUs from '../pages/AboutUs';
import Calendar from '../pages/Calendar';
import Settings from '../pages/Settings';
import Support from '../pages/Support';
import AdminDashboard from '../pages/AdminDashboard';
import VolunteerDashboard from '../pages/VolunteerDashboard';
import UserDashboard from '../pages/UserDashboard';
import { getCurrentUser } from '../utils/auth';

function DashboardRedirect() {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    if (user.role === 'admin') {
        return <Navigate to="/dashboard/admin" replace />;
    }

    if (user.role === 'volunteer') {
        return <Navigate to="/dashboard/volunteer" replace />;
    }

    return <Navigate to="/dashboard/user" replace />;
}

function RoleGuard({ allowedRoles, children }) {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <DashboardRedirect />;
    }

    return children;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<UserDashboard />} />
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
                        path="dashboard/volunteer"
                        element={
                            <RoleGuard allowedRoles={['volunteer', 'admin']}>
                                <VolunteerDashboard />
                            </RoleGuard>
                        }
                    />
                    <Route
                        path="dashboard/user"
                        element={
                            <RoleGuard allowedRoles={['user', 'volunteer', 'admin']}>
                                <UserDashboard />
                            </RoleGuard>
                        }
                    />
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
