// import { useSelector } from "react-redux";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Authenticate = () => {
  const authSelector = useSelector((state) => state.auth.auth);
  if (authSelector) {
    if (authSelector.user.role === "user") {
      return <Outlet />;
    }
    return <Navigate to="/admin" />;
  }
  return <Navigate to="/login" />;
};

const AuthenticateAdmin = () => {
  const authSelector = useSelector((state) => state.auth.auth);
  if (authSelector) {
    if (authSelector.user.role === "admin") {
      return <Outlet />;
    }
    return <Navigate to="/" />;
  }
  return <Navigate to="/login" />;
};

export { Authenticate, AuthenticateAdmin };
