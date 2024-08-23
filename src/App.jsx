import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./app.css";
import Home from "./componets/Home";
import Signup from "./componets/Signup";
import Nav from "./componets/Nav";
import Login from "./componets/Login";
import { useEffect, useState } from "react";
import Logout from "./componets/Logout";
import CryptoJS from "crypto-js";

function App() {
  const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
  const SECRET_KEY = "your-secret-key"; // Same key used for encryption

  const decryptData = (ciphertext) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData); // Parse after decrypting
    } catch (error) {
      console.error("Decryption error:", error);
      return null; // Return null if decryption fails
    }
  };

  const [session, setSession] = useState(() => {
    const encryptedSession = localStorage.getItem("session");
    if (encryptedSession) {
      return decryptData(encryptedSession); // Decrypt and then parse
    }
    return null;
  });


  const logoutUser = () => {
    setSession(null);
    localStorage.removeItem("session");
    localStorage.removeItem("lastActivityTime");
    window.location.href = "/login";
  };

   useEffect(() => {
    const handleActivity = () => {
      localStorage.setItem("lastActivityTime", Date.now().toString());
    };

    // Listen for any activity to reset the timeout timer
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    const checkTimeout = () => {
      const lastActivityTime = localStorage.getItem("lastActivityTime");
      if (lastActivityTime && Date.now() - parseInt(lastActivityTime) > SESSION_TIMEOUT) {
        logoutUser();
      }
    };

    const intervalId = setInterval(checkTimeout, 10000); // Check every 10 seconds

    // Clean up listeners and interval on component unmount
    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Router>
      <Nav session={session} />
      <Routes>
      <Route path="/*" element={<Home session={session} />} /> {/* Added wildcard */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setSession={setSession} />} />
        <Route path="/logout" element={<Logout setSession={setSession} />} />
      </Routes>
    </Router>
  );
}

export default App;

