"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type AuthContextType = {
  user: any;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      router.replace("/login"); // إذا ما في توكن → إعادة توجيه لصفحة Login
      return;
    }

    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        router.replace("/login"); // إذا التوكن غير صالح → إعادة Login
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}

    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login"); // ✅ redirect آمن
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
