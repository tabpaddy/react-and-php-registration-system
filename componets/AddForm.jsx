import { useState, useReducer } from "react";
import styles from "./addForm.module.css";

export default function AddForm({ session }) {
  const isLoggedInId = session.log_id;

  const initialState = {
    user_id: isLoggedInId,
    name: "",
    email: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_FIELD_VALUE":
        return { ...state, [action.field]: action.value };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  };

  const [addFormData, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD_VALUE", field: name, value });
    
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!addFormData.name.trim()) {
      valid = false;
      newErrors.name = "Name is required";
    }

    if (!addFormData.email.trim()) {
      valid = false;
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(addFormData.email)) {
      valid = false;
      newErrors.email = "Email is not valid";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8080/phpReactServer/controller/post.php',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // This is crucial to send cookies
          body: JSON.stringify(addFormData),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setMessage(result.message);
        dispatch({ type: "RESET_FORM" });

        setTimeout(() => {
          window.location.href = result.redirect || "/";
        }, 2000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form_container}>
      <p className={styles.title}>Add User</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input_group}>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            value={addFormData.name}
            disabled={loading}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.input_group}>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            value={addFormData.email}
            disabled={loading}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <button className={styles.sign} disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
