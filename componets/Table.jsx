import { useEffect, useState } from "react";
import styles from "./table.module.css";

export default function Table({ session, handleNavigation }) {
  const user_id = session.log_id;

  const URL = `http://localhost:8080/phpReactServer/controller/post.php?uid=${user_id}`;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // Ensure cookies are sent
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const text = await res.text();

        // Check if the response is JSON
        try {
          const data = JSON.parse(text);
          setData(data);
        } catch (err) {
          console.error("Response is not valid JSON:", text);
          setError("Invalid response format.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user_id]);

  const handleEdit = (id) => {
    handleNavigation(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        const res = await fetch(`http://localhost:8080/phpReactServer/controller/post.php`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // Ensure cookies are sent
          body: JSON.stringify({ post_id: id, user_id }),
        });

        const result = await res.json();

        if (res.ok) {
          setData(data.filter((item) => item.id !== id));
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>S/n</th>
            <th>Name</th>
            <th>Email</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <div className={styles.buttonGap}>
                    <button
                      className={styles.btnEdit}
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
