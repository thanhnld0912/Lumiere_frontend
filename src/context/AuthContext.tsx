/**
 * FILE MỚI — trạng thái đăng nhập dùng chung.
 *
 * Trước đây frontend không có khái niệm user: ProfileView hardcode tên/email
 * trong JSX (ProfileView.tsx:31-46) và mọi state per-user (bookmark, tiến độ
 * đọc) nằm trong localStorage.
 *
 * Context này giữ token + thông tin user, và tự khôi phục phiên khi tải lại trang.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi, clearToken, getToken, setToken } from '../services/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** true trong lúc khôi phục phiên lúc mới tải trang — dùng để tránh chớp UI. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  /** Tải lại user (gồm cả stats) sau khi bookmark/đọc chương thay đổi số liệu. */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => getToken() !== null);

  // Khôi phục phiên khi mount. Token còn trong localStorage nhưng đã hết hạn thì
  // api client tự xoá và ta về trạng thái khách.
  useEffect(() => {
    if (!getToken()) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    authApi
      .me()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    setToken(result.token);
    // Lấy lại qua /me để có thêm `stats` mà endpoint login không trả.
    const me = await authApi.me().catch(() => result.user);
    setUser(me);
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const result = await authApi.register(email, password, displayName);
    setToken(result.token);
    const me = await authApi.me().catch(() => result.user);
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) return;
    try {
      setUser(await authApi.me());
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, isLoading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  }
  return context;
}