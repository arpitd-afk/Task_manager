import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedTime = localStorage.getItem("loginTime");

      if (storedToken && storedUser && storedTime) {
        const timeElapsed = Date.now() - parseInt(storedTime, 10);

        if (timeElapsed < EXPIRATION_TIME) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          logout();
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const login = (newToken, newUser) => {
    const currentTime = Date.now();
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("loginTime", currentTime.toString());
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  const isAuthenticated = () => !!token;

  const getUserRole = () => user?.role || null;

  const getUserId = () => user?.id || null;

  useEffect(() => {
    const publicPaths = ["/auth/login", "/auth/signup"];
    if (isAuthenticated() && publicPaths.includes(router.pathname)) {
      router.push("/dashboard");
    } else if (!isAuthenticated() && !publicPaths.includes(router.pathname)) {
      router.push("/auth/login");
    }
    setTimeout(3000);
  }, [router.pathname, token]);

  useEffect(() => {
    if (token) {
      const storedTime = localStorage.getItem("loginTime");
      if (!storedTime) return;

      const remainingTime =
        EXPIRATION_TIME - (Date.now() - parseInt(storedTime, 10));

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          logout();
        }, remainingTime);

        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        login,
        logout,
        isAuthenticated,
        getUserRole,
        getUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
