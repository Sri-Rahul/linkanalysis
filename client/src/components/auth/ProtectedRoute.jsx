import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute component that checks if user is authenticated
 * Redirects to login page if not authenticated
 */
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;