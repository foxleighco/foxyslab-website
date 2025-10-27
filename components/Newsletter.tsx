"use client";

import { useState, FormEvent } from "react";
import { isValidEmail, sanitizeInput } from "@/lib/validation";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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

    try {
      // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus("success");
      setMessage("Thanks for subscribing! Check your email to confirm.");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <section id="newsletter" className="bg-gradient-to-r from-primary/20 to-accent-orange/20 rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay Updated
        </h2>
        <p className="text-white/80 mb-8">
          Get the latest tutorials, tips, and smart home news delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            className="flex-1 px-6 py-3 rounded-full bg-secondary border border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3 gradient-primary rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success" ? "text-accent-yellow" : "text-red-400"
            }`}
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
