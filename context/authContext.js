import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token =
          localStorage.getItem("token") || Cookies.get("tokenfromfron");
        console.log("Token From Cookie:", token);
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get("http://localhost:5000/api/me");
          console.log("Auth Verify Response:", response.data);
          if (response.data.success) {
            setUser(response.data.user);
            console.log("User Set:", response.data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log("Error Verifying Token:", err);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("Loading Set To False");
      }
    };
    verifyToken();
  }, []);

  const login = (user) => setUser(user);
  const logout = () => {
    setUser(null);
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
