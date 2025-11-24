import React from "react";
import styles from "./AboutUs.module.css";

export default function AboutUs() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        About <span>Us</span>
      </h1>

      <div className={styles.card}>
        <p>
          Welcome to <strong>FooBoo</strong>, your smart meal booking platform
          designed for offices and teams. We make it simple for employees to
          browse menus, reserve meals, and earn points every time they book.
        </p>

        <p>
          Our mission is to reduce food wastage, simplify meal distribution,
          and offer a seamless booking experience. We combine clean UI,
          fast performance, and automated booking workflows to keep everything
          efficient.
        </p>

        <p>
          Whether you're an employee planning your meals or an admin managing food
          schedules, FooBoo helps you stay organized, informed, and happy.
        </p>

        <p className={styles.bottomText}>
          Thanks for using FooBoo — we’re glad to have you here!
        </p>
      </div>
    </div>
  );
}
