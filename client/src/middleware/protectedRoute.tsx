import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface ProtectedRouteProps {
  element: JSX.Element;
  role: "Teacher" | "Student";
}

const ProtectedRoute = ({ element, role }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === "Teacher" ? "/Teacher" : "/Student"} replace />;
  }

  return element;
};

export default ProtectedRoute;