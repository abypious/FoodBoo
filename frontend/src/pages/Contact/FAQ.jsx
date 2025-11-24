import React, { useState } from "react";
import styles from "./FAQ.module.css";

export default function FAQ() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => {
    setOpen(open === i ? null : i);
  };

  const faqs = [
    {
      q: "How do I make a food booking?",
      a: "Go to the Food menu, select an item, choose a date and meal time, and confirm your booking.",
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes. You can cancel any booking before its meal time. Completed bookings cannot be cancelled.",
    },
    {
      q: "How do points work?",
      a: "You earn points for every successful booking and lose a few for cancellations.",
    },
    {
      q: "Who do I contact for support?",
      a: "You can reach us via the Contact Us page for any help or issues.",
    },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Frequently Asked <span>Questions</span>
      </h1>

      <div className={styles.card}>
        {faqs.map((item, i) => (
          <div key={i} className={styles.faqItem}>
            <div className={styles.question} onClick={() => toggle(i)}>
              {item.q}
              <span>{open === i ? "−" : "+"}</span>
            </div>

            {open === i && <p className={styles.answer}>{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
