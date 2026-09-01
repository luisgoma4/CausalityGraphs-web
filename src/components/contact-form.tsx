"use client";

import { useState, type SubmitEvent } from "react";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

// NEXT_PUBLIC_* is inlined at build time, so an unset value cannot be
// recovered at runtime: the form ships with access_key="" and Web3Forms
// rejects every submission with no visible cause. That is exactly how a
// deploy went out silently broken once. Fail the production build instead
// of shipping a form that cannot work. Dev is left tolerant so the site
// still runs without credentials.
if (process.env.NODE_ENV === "production" && !WEB3FORMS_ACCESS_KEY) {
  throw new Error(
    "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set. The contact form would be " +
      "built with an empty access key and every submission would fail. Set it " +
      "in .env.local locally, or as the WEB3FORMS_ACCESS_KEY repository secret " +
      "for the GitHub Actions build.",
  );
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form card-sheen contact-form-status" role="status">
        <p className="eyebrow">Message sent</p>
        <h2>Thanks — we&apos;ll reply personally within one business day.</h2>
      </div>
    );
  }

  return (
    <form className="contact-form card-sheen" onSubmit={handleSubmit}>
      <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
      <input type="hidden" name="subject" value="New inquiry from causalitygraphs.com" />
      <input type="text" name="botcheck" className="sr-only" tabIndex={-1} autoComplete="off" />

      <label>
        Name
        <input type="text" name="name" placeholder="Your name" required />
      </label>
      <label>
        Organization
        <input type="text" name="organization" placeholder="Company or research group" />
      </label>
      <label>
        Email
        <input type="email" name="email" placeholder="you@example.com" required />
      </label>
      <label>
        Project type
        <select name="projectType" defaultValue="DAG review">
          <option>DAG review</option>
          <option>Dynamic causal modeling</option>
          <option>Study interpretation</option>
          <option>Evidence strategy</option>
        </select>
      </label>
      <label className="full-span">
        Brief description
        <textarea
          name="description"
          rows={6}
          placeholder="Describe the study design, key constraints, and the decision you need to support."
          required
        />
      </label>

      <button type="submit" className="button button-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send inquiry"}
      </button>

      {status === "error" && (
        <p className="full-span contact-form-error" role="alert">
          Something went wrong sending your message. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
