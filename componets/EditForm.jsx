import { useEffect, useState } from "react";
import styles from "./addForm.module.css";
import { useParams } from "react-router-dom";

export default function EditForm({ session }) {
  const user_id = session.log_id;
  const { id } = useParams(); // Get the `id` from the URL
  const [editFormData, setFormData] = useState({
    post_id: id,
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:8080/phpReactServer/controller/post.php?post=${id}&uid=${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data); // Log the data to check if it's correct

        // Check if the data is an array and has at least one item
        if (Array.isArray(data) && data.length > 0) {
          const postData = data[0]; // Access the first object in the array

          setFormData({
            post_id: id || "",
            name: postData.name || "",
            email: postData.email || "",
          });
        } else {
          setMessage("Data not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data.");
      }
    }

    fetchData();
  }, [id, user_id]); // Dependency array includes `id` and `user_id` to re-fetch data if they change

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
  };

  function validateForm() {
    let valid = true;
    const newErrors = {};

    if (!editFormData.name.trim()) {
      valid = false;
      newErrors.name = "Name is required";
    }

    if (!editFormData.email.trim()) {
      valid = false;
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      valid = false;
      newErrors.email = "Email is not valid";
    }

    setErrors(newErrors);
    return valid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    try {
      const payload = { ...editFormData, user_id: session.log_id }; // Ensure user_id is included
      //console.log('Payload sent:', payload);

      const response = await fetch(
        `http://localhost:8080/phpReactServer/controller/post.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // This is crucial to send cookies
          body: JSON.stringify(payload),
        }
      );

      //console.log("Edit Form Data before submission:", editFormData);

      
      const result = await response.json();

      //console.log('Response:', result);


      if (response.ok) {
        if (result.status === "success") {
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
    <div className={styles.form_container}>
      <p className={styles.title}>Edit User</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input_group}>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            placeholder=""
            value={editFormData.name}
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
            placeholder=""
            value={editFormData.email}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <button className={styles.sign}>Edit User</button>
      </form>
      <div className={styles.social_message}>
        <div className={styles.line}></div>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.line}></div>
      </div>
    </div>
  );
}
