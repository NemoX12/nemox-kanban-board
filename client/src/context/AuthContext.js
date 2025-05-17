import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState({ first_name: "", last_name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5542/auth/check", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.authenticated) {
          setUserData({ first_name: data.first_name, last_name: data.last_name });
          setToken(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async () => {
    const res = await fetch("http://localhost:5542/auth/check", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUserData({ first_name: data.first_name, last_name: data.last_name });
      setToken(true);
    }
  };

  const logout = async () => {
    await fetch("http://localhost:5542/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setToken(null);
    setUserData({ first_name: "", last_name: "" });
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ token, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
