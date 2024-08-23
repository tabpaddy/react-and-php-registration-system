import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ setSession }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the session data
    setSession(null);
    localStorage.removeItem("session"); // Also clear it from localStorage
    // Redirect to the login page
    navigate("/login");
  }, [setSession, navigate]);

  return null;
}
