"use client";

import { useState } from "react";

type Category = "question" | "bug" | "suggestion" | "other";

export default function ContactForm() {
  const [category, setCategory] = useState<Category>("question");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `[${category.charAt(0).toUpperCase() + category.slice(1)}] from ${name || "BunchofCalcs visitor"}`
    );
    const body = encodeURIComponent(
      `Category: ${category}\nName: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:hello@bunchofcalcs.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          Your email client should have opened with your message. If it didn&apos;t,
          email us directly at hello@bunchofcalcs.com.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-3 text-sm text-green-600 underline hover:text-green-700 dark:text-green-400"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          What is this about?
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="question">General Question</option>
          <option value="bug">Bug Report</option>
          <option value="suggestion">Calculator Suggestion</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what's on your mind..."
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 active:bg-amber-700"
      >
        Send Message
      </button>
    </form>
  );
}
