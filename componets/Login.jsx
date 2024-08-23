import { Link } from "react-router-dom";
import styles from "./login.module.css";
import { useState } from "react";
import CryptoJS from "crypto-js";

export default function Login({ setSession }) {
  const [loginData, setLoginData] = useState({
    type: "login",
    username_email: "",
    password: "",
  });

  // for errors message
  const [errors, setErrors] = useState({});

  // for success and error message
  const [message, setMessage] = useState("");

  const SECRET_KEY = "your-secret-key"; // Use a strong secret key

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };

  const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // clear error message for the current field
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // validate form
  function validateForm() {
    let valid = true;
    const newErrors = {};

    // Check if username is empty
    if (!loginData.username_email.trim()) {
      valid = false;
      newErrors.username_email = "Username or Email is required";
    }

    // Check if password is empty
    if (!loginData.password.trim()) {
      valid = false;
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return valid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    console.log(loginData);
    try {
      const response = await fetch(
        "http://localhost:8080/phpReactServer/controller/user.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // This is crucial to send cookies
          body: JSON.stringify(loginData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        if (result.status === "success") {
          //  const sessionData = result.session;

          // const userId = sessionData.log_id;
          // const username = sessionData.log_username;
          // const email = sessionData.log_email;

          // console.log(userId);
          // console.log(username);
          // console.log(email);
          
          
          setSession(result.session);

          const encryptedSession = encryptData(result.session);
          localStorage.setItem("session", encryptedSession);
          localStorage.setItem("lastActivityTime", Date.now().toString());

          setMessage(result.message);

          setTimeout(() => {
            window.location.href = result.redirect || "/";
          }, 2000);
        } else {
          setMessage(result.message);
          setTimeout(() => {
            setMessage("");
          }, 4000);
        }
      }
    } catch (error) {
      setMessage("An error Occurred " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>Login </p>
        <p className={styles.message}>Login to access your details. </p>
        <input type="hidden" name="type" value={loginData.type} />
        <label>
          <input
            onChange={handleChange}
            className={styles.input}
            type="text"
            placeholder=""
            name="username_email"
            value={loginData.username_email}
          />
          <span>Username or Email</span>
        </label>
        {errors.username_email && (
          <p className={styles.error}>{errors.username_email}</p>
        )}
        <label>
          <input
            onChange={handleChange}
            className={styles.input}
            type="password"
            placeholder=""
            name="password"
            value={loginData.password}
          />
          <span>Password</span>
        </label>
        {errors.password && <p className={styles.error}>{errors.password}</p>}
        <button className={styles.submit}>Submit</button>
        {message && <p className={styles.messages}>{message}</p>}
        <p className={styles.signin}>
          Don't have an account ? <Link to="/Signup">Signup</Link>{" "}
        </p>
      </form>
    </div>
  );
}

//  Consider implementing token-based authentication (e.g., JWT) for even better security in your React app