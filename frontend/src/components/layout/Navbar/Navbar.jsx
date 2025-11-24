import styles from "./Navbar.module.css";
import useAuthStore from "../../../store/authStore";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link 
          to={user?.role === "ROLE_ADMIN" ? "/admin/dashboard" : "/employee/categories"}
          className={styles.homeLink}
        >
          <div className={styles.left}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <h2 className={styles.title}>
          Welcome to <span>FooBoo</span>
        </h2>
      </div></Link>

      <div className={styles.center} ref={dropdownRef}>
        <div
          className={styles.location}
          onClick={() => setOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-location-dot"></i>
          Bangalore
          <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
        </div>

        {open && (
          <div className={styles.dropdown}>
            <div
              className={styles.option}
              onClick={() => setOpen(false)}
            >
              Bangalore
            </div>
          </div>
        )}
      </div>

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

        <Link to="/profile" className={styles.avatar}>
          <img src="/Profile.png" />
        </Link>
      </div>
    </nav>
  );
}
