import styles from "./Navbar.module.css";
import useAuthStore from "../../../store/authStore";
import { Link } from "react-router-dom";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className={styles.navbar}>
      {/* LEFT: Logo + Title */}
      <div className={styles.left}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <h2 className={styles.title}>
          Welcome to <span>FooBoo</span>
        </h2>
      </div>

      {/* CENTER: Location */}
      <div className={styles.center}>
        <div className={styles.location}>
          <i className="fa-solid fa-location-dot"></i>
          Bangalore <span className={styles.arrow}>▼</span>
        </div>
      </div>

      {/* RIGHT: Links, signout, user */}
      <div className={styles.right}>
        <Link 
          to={user?.role === "ROLE_ADMIN" ? "/admin/dashboard" : "/employee/categories"}
        >
          Home
        </Link>
        <Link to="/contact">Contact Us</Link>

        <div className={styles.divider}></div>

        <button onClick={logout} className={styles.signout}>Sign Out</button>

        <span className={styles.username}>{user?.name}</span>

        <div className={styles.avatar}>
          <img src="/Profile.png"/>
        </div>
      </div>
    </nav>
  );
}
