import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ({ children, unprotected = false }) {
  const auth = useSelector((state) => state.auth);

  const isAdmin = auth.user?.roles?.includes("Admin");
  const isEmployee = auth.user?.roles?.includes("Employee");

  const isAuth = auth.authenticated && (isAdmin || isEmployee);

  const path = isAuth ? "/dashboard" : "/customer";

  return unprotected || !auth.authenticated ? (
    children
  ) : (
    <Navigate to={path} replace />
  );
}
