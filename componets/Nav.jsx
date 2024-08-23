import { Link } from "react-router-dom";
import styles from "./nav.module.css";
export default function Nav({session}) {
  const isLoggedIn = session && session.log_id; // Check if session exists and user is logged in
  return (
    <nav>
      <div className={styles.navContainer}>
        <div>
          <h2 className={styles.navName}>
            <Link to="/">Home</Link>
          </h2>
        </div>

        <div>
          <ul className={styles.navUl}>
          {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/Login">Login</Link>
                </li>
                <li>
                  <Link to="/Signup">Signup</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span>Welcome, {session.log_username}</span>
                </li>
                <li>
                  <Link to="/Logout">Logout</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
