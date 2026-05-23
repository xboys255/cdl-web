"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-2">Questions, corrections, or feedback? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: "🐛", title: "Found an Error?", desc: "Let us know if a question or answer seems incorrect." },
          { icon: "💡", title: "Suggest a Topic", desc: "Want us to add more questions for a specific CDL section?" },
          { icon: "❓", title: "General Questions", desc: "Anything else about the site or the CDL exams." },
        ].map((item) => (
          <div key={item.title} className="bg-gray-50 rounded-xl p-4 text-center">
            <span className="text-2xl">{item.icon}</span>
            <p className="font-semibold text-gray-900 mt-1 text-sm">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {status === "sent" ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-2">
          <p className="text-2xl">✅</p>
          <p className="font-semibold text-green-800">Message sent!</p>
          <p className="text-sm text-green-700">Thanks for reaching out. We typically respond within 1–2 business days.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              id="subject"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">Select a subject…</option>
              <option value="Question error">Question error or correction</option>
              <option value="Content suggestion">Content suggestion</option>
              <option value="Technical issue">Technical issue</option>
              <option value="General question">General question</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what's on your mind…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">Something went wrong. Please try again or email us directly.</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send Message →"}
          </button>
        </form>
      )}

      <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
        <p>You can also reach us directly at <a href="mailto:support@cdlprepkit.com" className="text-orange-600 hover:underline">support@cdlprepkit.com</a></p>
      </div>
    </div>
  );
}
