import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUtensils,
  faTag,
  faStar,
  faClipboardList,
  faSignOutAlt,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../../../store/authStore";
import styles from "./AdminSidebar.module.css";

export default function AdminSidebar() {
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.menu}>
        <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/admin/dashboard">
          <FontAwesomeIcon icon={faChartLine} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/admin/employees">
          <FontAwesomeIcon icon={faUsers} />
          <span>Employees</span>
        </NavLink>

        <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/admin/bookings">
          <FontAwesomeIcon icon={faClipboardList} />
          <span>Bookings</span>
        </NavLink>

        <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/admin/categories">
          <FontAwesomeIcon icon={faTag} />
          <span>Categories</span>
        </NavLink>

        <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/admin/foods">
          <FontAwesomeIcon icon={faUtensils} />
          <span>Foods</span>
        </NavLink>

        <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/admin/reviews">
          <FontAwesomeIcon icon={faStar} />
          <span>Reviews</span>
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
