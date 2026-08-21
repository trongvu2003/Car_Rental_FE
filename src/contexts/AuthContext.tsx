import { createContext, useState, useEffect, ReactNode } from "react";
import authApi from "../api/auth.api";
import type { User } from "../types/user.types";
import type { AuthContextValue } from "../types/auth.types";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chạy đúng MỘT LẦN khi app khởi động (vì Provider chỉ mount 1 lần ở gốc cây component)
  useEffect(() => {
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false));
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const user = await authApi.register({ name, email, password });
      return user;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Đăng ký thất bại";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authApi.login({ email, password });
      // Cập nhật state chung -> mọi component dùng useAuth() đều thấy user mới ngay lập tức
      setUser(data.user);
      return data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Đăng nhập thất bại";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initializing,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
