"use client";

import { useState } from "react";

// Set your ConvertKit form ID in .env as NEXT_PUBLIC_CONVERTKIT_FORM_ID
const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;

interface EmailCaptureProps {
  headline?: string;
  description?: string;
  tag?: string;
}

export default function EmailCapture({
  headline = "Get the Freelancer Tax Cheat Sheet",
  description = "A one-page PDF with current tax rates, deduction categories, and quarterly due dates. Updated for the current tax year.",
  tag,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!FORM_ID) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY,
          email,
          tags: tag ? [tag] : [],
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="mt-10 rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950 print:hidden">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          Check your inbox -- the cheat sheet is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 dark:border-blue-800 dark:from-blue-950 dark:to-gray-900 print:hidden">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{headline}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 sm:w-64 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send me the PDF"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-center text-xs text-red-600 dark:text-red-400">
          Something went wrong. Try again or email hello@bunchofcalcs.com.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
