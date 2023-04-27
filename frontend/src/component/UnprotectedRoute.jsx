import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ({ userRoles = [] }) {
  const auth = useSelector((state) => state.auth);

  const isAuth =
    auth.authenticated &&
    (userRoles.length === 0 ||
      userRoles.some((role) => auth.user.roles.includes(role)));

  const path = isAuth ? "/dashboard" : "/customer";

  return <Navigate to={path} replace />;
}
