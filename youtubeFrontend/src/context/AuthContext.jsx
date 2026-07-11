import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.api";
import { AuthContext } from "./AuthContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res?.data?.data || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser,  loading, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
