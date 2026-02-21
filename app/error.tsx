"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={`${styles.title} gradient-text`}>Oops!</h1>
        <h2 className={styles.subtitle}>Something went wrong</h2>
        <p className={styles.message}>
          We&apos;re sorry for the inconvenience. An error occurred while loading this page.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
