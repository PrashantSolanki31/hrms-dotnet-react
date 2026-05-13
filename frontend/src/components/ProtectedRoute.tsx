import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type Role } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  roles?: Role[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === "HR" ? "/hr" : "/employee";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
