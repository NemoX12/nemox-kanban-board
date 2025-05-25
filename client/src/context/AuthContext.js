import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://nemox-kanban-board.onrender.com/auth/check", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.authenticated) {
          setUserData({
            first_name: data.first_name,
            last_name: data.last_name,
            photoUrl: data.photoUrl || "",
          });
          setToken(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async () => {
    const res = await fetch("https://nemox-kanban-board.onrender.com/auth/check", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUserData({
        first_name: data.first_name,
        last_name: data.last_name,
        photoUrl: data.photoUrl || "",
      });
      setToken(true);
    }
  };

  const logout = async () => {
    await fetch("https://nemox-kanban-board.onrender.com/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setToken(null);
    setUserData({ first_name: "", last_name: "", photoUrl: "" });
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ token, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
