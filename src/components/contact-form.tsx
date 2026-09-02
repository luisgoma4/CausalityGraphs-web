"use client";

import { useState, type FormEvent } from "react";
import type { SiteContent } from "@/lib/content";

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

export function ContactForm({ content }: { content: SiteContent }) {
  const { form } = content.contact;
  const [status, setStatus] = useState<Status>("idle");
  // Web3Forms explains its own rejections (unverified address, spam filter,
  // bad key). Keeping the reason makes a failure diagnosable instead of a
  // generic "something went wrong".
  const [reason, setReason] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const element = event.currentTarget;
    const payload = Object.fromEntries(new FormData(element));

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
        element.reset();
      } else {
        setReason(typeof result.message === "string" ? result.message : null);
        setStatus("error");
      }
    } catch (error) {
      setReason(error instanceof Error ? error.message : null);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form card-sheen contact-form-status" role="status">
        <p className="eyebrow">{form.successEyebrow}</p>
        <h2>{form.successTitle}</h2>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
      <input type="hidden" name="subject" value="New inquiry from causalitygraphs.com" />
      {/* Honeypot. Must be display:none, not .sr-only: an sr-only input is still
          rendered and still in the accessibility tree, so browser autofill and
          password managers can put a value in it. Any value here makes Web3Forms
          classify the submission as a bot and drop it — while still answering
          success: true, so the visitor sees "message sent" and nothing arrives.
          A checkbox is the shape Web3Forms documents. */}
      <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} />

      <label htmlFor="contact-name">
        {form.nameLabel}
        <input id="contact-name" type="text" name="name" placeholder={form.namePlaceholder} required />
      </label>
      <label htmlFor="contact-organization">
        {form.organizationLabel}
        <input
          id="contact-organization"
          type="text"
          name="organization"
          placeholder={form.organizationPlaceholder}
        />
      </label>
      <label htmlFor="contact-email">
        {form.emailLabel}
        <input id="contact-email" type="email" name="email" placeholder={form.emailPlaceholder} required />
      </label>
      <label htmlFor="contact-project-type">
        {form.projectTypeLabel}
        <select id="contact-project-type" name="projectType" defaultValue={form.projectTypeOptions[0]}>
          {form.projectTypeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="full-span" htmlFor="contact-description">
        {form.descriptionLabel}
        <textarea
          id="contact-description"
          name="description"
          rows={6}
          placeholder={form.descriptionPlaceholder}
          required
        />
      </label>

      <button type="submit" className="button button-primary" disabled={status === "submitting"}>
        {status === "submitting" ? form.sendingLabel : form.submitLabel}
      </button>

      {status === "error" && (
        <p className="full-span contact-form-error" role="alert">
          {form.errorMessage}
          {reason ? ` (${reason})` : ""}
        </p>
      )}
    </form>
  );
}
