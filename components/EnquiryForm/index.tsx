"use client";

import { useState, useTransition } from "react";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

interface FormData {
  name: string;
  email: string;
  company: string;
  enquiryType: string;
  message: string;
  website: string; // Honeypot field
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  enquiryType: "",
  message: "",
  website: "", // Honeypot - should remain empty
};

export function EnquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.enquiryType) {
      newErrors.enquiryType = "Please select an enquiry type";
    }

    if (!formData.message.trim() || formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/enquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus("success");
          setSubmitMessage(data.message || "Thank you for your enquiry!");
          setFormData(initialFormData);
        } else {
          setSubmitStatus("error");
          setSubmitMessage(data.error || "Something went wrong. Please try again.");
        }
      } catch {
        setSubmitStatus("error");
        setSubmitMessage("Unable to send your message. Please try again later.");
      }
    });
  };

  if (submitStatus === "success") {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg className={styles.successIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Message Sent!</h3>
        <p className={styles.successMessage}>{submitMessage}</p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className={styles.successButton}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {submitStatus === "error" && (
        <div className={styles.errorAlert} role="alert">
          <p className={styles.errorAlertText}>{submitMessage}</p>
        </div>
      )}

      {/* Honeypot field - hidden from real users */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">
          Website (leave blank)
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className={styles.grid}>
        {/* Name */}
        <div>
          <label htmlFor="name" className={styles.label}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            placeholder="Your name"
            required
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className={styles.fieldError} role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="your@email.com"
            required
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className={styles.fieldError} role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {/* Company */}
        <div>
          <label htmlFor="company" className={styles.label}>
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={styles.input}
            placeholder="Your company (optional)"
          />
        </div>

        {/* Enquiry Type */}
        <div>
          <label htmlFor="enquiryType" className={styles.label}>
            Enquiry Type <span className={styles.required}>*</span>
          </label>
          <select
            id="enquiryType"
            name="enquiryType"
            value={formData.enquiryType}
            onChange={handleChange}
            className={`${styles.select} ${errors.enquiryType ? styles.selectError : ""} ${!formData.enquiryType ? styles.selectPlaceholder : ""}`}
            required
            aria-invalid={errors.enquiryType ? "true" : "false"}
            aria-describedby={errors.enquiryType ? "type-error" : undefined}
          >
            <option value="" disabled>
              Select enquiry type
            </option>
            {siteConfig.enquiries.types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.enquiryType && (
            <p id="type-error" className={styles.fieldError} role="alert">
              {errors.enquiryType}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={styles.label}>
          Message <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={`${styles.textarea} ${errors.message ? styles.textareaError : ""}`}
          placeholder="Tell us about your enquiry..."
          required
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className={styles.fieldError} role="alert">
            {errors.message}
          </p>
        )}
        <p className={styles.hint}>Minimum 20 characters</p>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className={`${styles.submit} gradient-primary`}
        >
          {isPending ? (
            <>
              <svg className={styles.spinner} viewBox="0 0 24 24">
                <circle className={styles.spinnerBg} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className={styles.spinnerFg} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            "Send Enquiry"
          )}
        </button>
      </div>
    </form>
  );
}
