import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!email || !password) return;

    try {
      const user = await login(email, password);
      if (user.role === "ROLE_ADMIN") navigate("/admin/dashboard");
      else navigate("/employee/categories");
    } catch {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>Welcome Back</h1>

        <form onSubmit={submit} className={styles.form}>
          {/* USERNAME */}
          <label>Username</label>
          <input
            type="email"
            placeholder="Bob@Smith.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {touched && !email && (
            <p className={styles.error}>Enter a registered Email address</p>
          )}

          {/* PASSWORD */}
          <label>Password</label>
          <input
            type="password"
            placeholder="*************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {touched && !password && (
            <p className={styles.error}>Enter a valid password</p>
          )}

          {/* TERMS */}
          <div className={styles.checkboxRow}>
            <input type="checkbox" />
            <span>
              I agree to <strong>Terms & Conditions</strong> and{" "}
              <em>privacy Policy</em>
            </span>
          </div>

          {/* SIGN IN BUTTON */}
          <button className={styles.signinBtn}>Sign In</button>

          {/* SIGN UP LINK */}
          <div className={styles.signupRow}>
            Don’t have an account?{" "}
            <a className={styles.signupLink}>Sign Up</a>
          </div>

          {/* DIVIDER */}
          <div className={styles.divider}></div>

          {/* GUEST LOGIN */}
          <a className={styles.guestLink}>Continue as Guest</a>
        </form>
      </div>
    </div>
  );
}
