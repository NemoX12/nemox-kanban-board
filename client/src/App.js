import { useContext } from "react";
import Board from "./pages/Board";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const AppContent = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/board" /> : <SignIn />} />
      <Route path="/signup" element={token ? <Navigate to="/board" /> : <SignUp />} />
      <Route path="/board" element={token ? <Board /> : <Navigate to="/login" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/"
        element={token ? <Navigate to="/board" /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

const App = () => (
  <div className="App">
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  </div>
);

export default App;
