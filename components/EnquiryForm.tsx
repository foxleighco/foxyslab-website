"use client";

import { useState, useTransition } from "react";
import { siteConfig } from "@/site.config";

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
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
        <p className="text-white/70 mb-6">{submitMessage}</p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="px-6 py-2 border border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {submitStatus === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4" role="alert">
          <p className="text-red-400">{submitMessage}</p>
        </div>
      )}

      {/* Honeypot field - hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
            Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-secondary/50 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
              errors.name ? "border-red-500" : "border-primary/30 focus:border-primary"
            }`}
            placeholder="Your name"
            required
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
            Email <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-secondary/50 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
              errors.email ? "border-red-500" : "border-primary/30 focus:border-primary"
            }`}
            placeholder="your@email.com"
            required
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-secondary/50 border border-primary/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            placeholder="Your company (optional)"
          />
        </div>

        {/* Enquiry Type */}
        <div>
          <label htmlFor="enquiryType" className="block text-sm font-medium text-white/80 mb-2">
            Enquiry Type <span className="text-primary">*</span>
          </label>
          <select
            id="enquiryType"
            name="enquiryType"
            value={formData.enquiryType}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-secondary/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors appearance-none cursor-pointer ${
              errors.enquiryType ? "border-red-500" : "border-primary/30 focus:border-primary"
            } ${!formData.enquiryType ? "text-white/40" : ""}`}
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
            <p id="type-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.enquiryType}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
          Message <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={`w-full px-4 py-3 bg-secondary/50 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none ${
            errors.message ? "border-red-500" : "border-primary/30 focus:border-primary"
          }`}
          placeholder="Tell us about your enquiry..."
          required
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.message}
          </p>
        )}
        <p className="mt-1 text-xs text-white/50">Minimum 20 characters</p>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto px-8 py-4 gradient-primary rounded-full text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
