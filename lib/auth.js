import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;
const PUBLIC_PATHS = ["/", "/auth/login", "/auth/signup"];

const safeGetItem = (key) => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const safeRemoveItem = (key) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const hydrate = () => {
      const storedToken = safeGetItem("token");
      const storedUser = safeGetItem("user");
      const storedTime = safeGetItem("loginTime");

      if (storedToken && storedUser && storedTime) {
        const elapsed = Date.now() - parseInt(storedTime, 10);
        if (elapsed < EXPIRATION_TIME) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } catch {
            logout();
          }
        } else {
          logout();
        }
      }
      setReady(true);
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (!token) {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      return;
    }

    const storedTime = safeGetItem("loginTime");
    if (!storedTime) return;

    const remaining = EXPIRATION_TIME - (Date.now() - parseInt(storedTime, 10));

    if (remaining <= 0) {
      logout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, remaining);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [token]);

  const login = useCallback((newToken, newUser) => {
    const now = Date.now();
    safeSetItem("token", newToken);
    safeSetItem("user", JSON.stringify(newUser));
    safeSetItem("loginTime", now.toString());

    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    safeRemoveItem("token");
    safeRemoveItem("user");
    safeRemoveItem("loginTime");

    setToken(null);
    setUser(null);

    if (!PUBLIC_PATHS.includes(router.pathname)) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (!ready) return;

    const isPublic = PUBLIC_PATHS.includes(router.pathname);

    if (token && isPublic) {
      router.replace("/dashboard");
    } else if (!token && !isPublic) {
      router.replace("/auth/login");
    }
  }, [token, router.pathname, ready, router]);

  const isAuthenticated = () => !!token;
  const getUserRole = () => user?.role || null;
  const getUserId = () => user?.id || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        getUserRole,
        getUserId,
        ready,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
