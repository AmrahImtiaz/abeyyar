import { Navigate } from "react-router-dom";
import { getData } from "@/context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = getData();

  if (loading) return null; // or loader
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
