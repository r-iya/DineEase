import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />; // Redirect to home if unauthorized role
    }

    return <Outlet />;
};

export default ProtectedRoute;
