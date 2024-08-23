import { Routes, Route, useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import Table from "./Table";
import AddForm from "./AddForm";
import EditForm from "./EditForm";

export default function Home({ session }) {
  const isLoggedIn = session && session.log_id;

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className={styles.Welcome}>
        <h2>Welcome {isLoggedIn ? session.log_username : "Guest"}</h2>
      </div>
      <div>
        {isLoggedIn ? (
          <>
            <div className={styles.button}>
              <button
                className={styles.btn}
                onClick={() => handleNavigation("/add")}
              >
                Add User
              </button>
            </div>
            <hr className={styles.rule} />
            <div>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Table
                      session={session}
                      handleNavigation={handleNavigation}
                    />
                  }
                />
                <Route path="/add" element={<AddForm session={session} />} />
                <Route
                  path="/edit/:id"
                  element={<EditForm session={session} />}
                />
              </Routes>
            </div>
          </>
        ) : (
          <p>Please create an account or log in to perform an action</p>
        )}
      </div>
    </div>
  );
}
