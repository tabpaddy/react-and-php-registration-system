import { useState } from "react";
import styles from "./signup.module.css";
import { Link } from "react-router-dom";
export default function Signup() {
  // holds form data
  const [formData, setFormData] = useState({
    type: "register",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // for errors message
  const [errors, setErrors] = useState({});

  // for success and error message
  const [message, setMessage] = useState("");

  // to check password strength
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
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

    // Check password strength if password field is being updated
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  // validate form
  function validateForm() {
    let valid = true;
    const newErrors = {};

    // Check if username is empty
    if (!formData.username.trim()) {
      valid = false;
      newErrors.username = "Username is required";
    }

    // Check if email is empty
    if (!formData.email.trim()) {
      valid = false;
      newErrors.email = "Email is required";
    }

    // Check if password is empty
    if (!formData.password.trim()) {
      valid = false;
      newErrors.password = "Password is required";
    }

    // Check if confirm password is empty
    if (!formData.confirmPassword.trim()) {
      valid = false;
      newErrors.password = "Confirm Password is required";
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      valid = false;
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return valid;
  }

  const checkPasswordStrength = (password) => {
    let strength = "weak";
    const regexes = {
      strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      medium: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    };

    if (regexes.strong.test(password)) {
      strength = "Your Password is Strong";
    } else if (regexes.medium.test(password)) {
      strength = "Your Password is medium";
    }

    setPasswordStrength(strength);
  };

  //handle form submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    // console.log(formData);
    try {
      const response = await fetch(
        "http://localhost:8080/phpReactServer/controller/user.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // This is crucial to send cookies
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        if (result.status === "success") {
          setMessage(result.message);

          setTimeout(() => {
            window.location.href = result.redirect || "/login";
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
    <div className={styles.signupContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>Register </p>
        <p className={styles.message}>
          Signup now and get full access to our app.{" "}
        </p>
        <input type="hidden" name="type" value={formData.type} />
        <div>
          <label>
            <input
              onChange={handleChange}
              className={styles.input}
              type="text"
              placeholder=""
              name="username"
              value={formData.username}
            />
            <span>Username</span>
          </label>
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>
        <div>
          <label>
            <input
              onChange={handleChange}
              className={styles.input}
              type="email"
              placeholder=""
              name="email"
              value={formData.email}
            />
            <span>Email</span>
          </label>
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div>
          <label>
            <input
              onChange={handleChange}
              className={styles.input}
              type="password"
              placeholder=""
              name="password"
              value={formData.password}
            />
            <span>Password</span>
          </label>
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div>
          <label>
            <input
              onChange={handleChange}
              className={styles.input}
              type="password"
              placeholder=""
              name="confirmPassword"
              value={formData.confirmPassword}
            />
            <span>Confirm Password</span>
          </label>
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>

        <button className={styles.submit}>Submit</button>
        {
          <p className={styles.strength}>
            Password strength: {passwordStrength}
          </p>
        }
        {message && <p className={styles.messages}>{message}</p>}
        <p className={styles.signin}>
          Already have an account ? <Link to="/Login">Login</Link>{" "}
        </p>
      </form>
    </div>
  );
}
