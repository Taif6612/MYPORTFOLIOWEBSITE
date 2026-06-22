import { useState } from "react";

/* Booking form.
   Works out of the box via a mailto: compose. To enable inline submission
   (no email client popup), get a FREE access key at https://web3forms.com
   (just enter your email — no signup) and paste it below. */
const WEB3FORMS_KEY = "";

export default function Booking({ profile }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries());

    // No key configured → compose an email with the details.
    if (!WEB3FORMS_KEY) {
      const subject = `Project booking — ${d.name || "New enquiry"}`;
      const body = [`Name: ${d.name}`, `Email: ${d.email}`, "", d.message].join("\n");
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    try {
      setStatus("sending");
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Project booking — ${d.name}`,
          ...d,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section booking" id="booking" aria-label="Book a project">
      <div className="shell booking-grid">
        <div className="booking-intro" data-lines>
          <p className="eyebrow">Booking</p>
          <h2 className="display booking-title line-mask">
            <span>Start a project</span>
          </h2>
          <p className="booking-lead reveal">
            Tell me what you're building and I'll reply within a day. Fixed scope or
            ongoing — landing pages, web apps, dashboards, and accessibility work.
          </p>
          <a className="booking-mail mono link reveal" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>

        <form className="booking-form reveal" onSubmit={onSubmit}>
          <div className="booking-row">
            <div className="field">
              <label htmlFor="bk-name">Name</label>
              <input id="bk-name" name="name" type="text" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="bk-email">Email</label>
              <input id="bk-email" name="email" type="email" required autoComplete="email" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="bk-message">What are you building?</label>
            <textarea id="bk-message" name="message" rows="5" required></textarea>
          </div>

          <div className="booking-actions">
            <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
              {status === "sending"
                ? "Sending…"
                : status === "sent"
                ? "Sent ✓"
                : "Send request →"}
            </button>
            {status === "sent" && (
              <span className="booking-note">Thanks — I'll be in touch shortly.</span>
            )}
            {status === "error" && (
              <span className="booking-note booking-note--err">
                Something went wrong — email me directly.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
