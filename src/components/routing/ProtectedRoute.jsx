import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/auth-ctx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log("PROTECTED ROUTE:", location.pathname);
  console.log("AUTH:", isAuthenticated);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    console.log("MANDANDO AL LOGIN CON FROM:", location);

    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
