import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   
import styles from "./ContactUs.module.css";
import toast from "react-hot-toast";

export default function ContactUs() {
  const navigate = useNavigate(); 

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill out all fields");
      return;
    }

    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
    setTouched(false);
  };

  return (
    <div className={styles.page}>

      <button className={styles.homeBtn} onClick={() => navigate(-1)}>
        ← Home
      </button>

      <h1 className={styles.title}>
        Contact <span>Us</span>
      </h1>

      <div className={styles.card}>
        <form onSubmit={submit} className={styles.form}>
          <label>Your Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={touched && !form.name ? styles.errorInput : ""}
          />

          <label>Your Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={touched && !form.email ? styles.errorInput : ""}
          />

          <label>Your Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className={touched && !form.message ? styles.errorInput : ""}
          />

          <button className={styles.submitBtn}>Send Message</button>
        </form>
      </div>
    </div>
  );
}
