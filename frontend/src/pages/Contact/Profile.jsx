import useAuthStore from "../../store/authStore";
import styles from "./Profile.module.css";

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <h2>No user logged in</h2>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img 
            src="/Profile.png" 
            alt="Profile" 
            className={styles.avatar}
          />
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.role}>{user.role.replace("ROLE_", "")}</p>
        </div>

        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>Name</span>
            <span className={styles.value}>{user.name}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user.email}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Role</span>
            <span className={styles.value}>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
