"use client";

import * as Sentry from "@sentry/nextjs";
import { useState, FormEvent } from "react";
import { isValidEmail, sanitizeInput } from "@/lib/validation";
import styles from "./styles.module.css";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email);

    if (!isValidEmail(sanitizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    await Sentry.startSpan(
      {
        op: "ui.submit",
        name: "Newsletter Signup",
      },
      async () => {
        try {
          // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
          // For now, just simulate success
          await new Promise((resolve) => setTimeout(resolve, 1000));

          setStatus("success");
          setMessage("Thanks for subscribing! Check your email to confirm.");
          setEmail("");

          setTimeout(() => {
            setStatus("idle");
            setMessage("");
          }, 5000);
        } catch (error) {
          Sentry.captureException(error);
          setStatus("error");
          setMessage("Something went wrong. Please try again later.");
        }
      }
    );
  };

  return (
    <section id="newsletter" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Stay Updated</h2>
        <p className={styles.description}>
          Get the latest tutorials, tips, and smart home news delivered straight
          to your inbox.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            className={styles.input}
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`${styles.button} gradient-primary`}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p
            className={
              status === "success" ? styles.messageSuccess : styles.messageError
            }
            role="alert"
            aria-live="polite"
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
