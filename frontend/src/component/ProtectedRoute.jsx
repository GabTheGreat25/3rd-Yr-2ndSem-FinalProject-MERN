import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ({ children, userRoles = [] }) {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const shouldRedirectToLogin =
    !auth?.authenticated ||
    (userRoles.length > 0 && !userRoles.includes(auth?.user?.roles));

  return shouldRedirectToLogin ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    children
  );
}
