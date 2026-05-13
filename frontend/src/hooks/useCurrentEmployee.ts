import { useEffect, useState } from "react";
import { useAuth, type AuthUser } from "@/context/AuthContext";

export interface EmployeeProfileData extends AuthUser {
  fullName?: string;
  phone?: string;
  department?: string;
  position?: string;
  jobTitle?: string;
  hireDate?: string;
  createdAt?: string;
}

/**
 * Uses only local auth context (no backend calls).
 * Backend /me endpoints not available yet.
 */
export function useCurrentEmployee() {
  const { user } = useAuth();
  const [data, setData] = useState<EmployeeProfileData | null>(user);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setData(user);
    setLoading(false);
  }, [user]);

  return { data, loading, error };
}