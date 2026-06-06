"use client";

import { useState } from "react";

// ── Change this to the business WhatsApp number (with country code, no spaces/+) ──
const WHATSAPP_NUMBER = "917560997700";

const inputStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  outline: "none",
  fontSize: "0.95rem",
  color: "var(--color-text-heading)",
  background: "#f8f9fa",
  transition: "border-color 0.2s ease",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  fontWeight: "700",
  color: "var(--color-text-heading)",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
};

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.message.trim()) e.message = "Please write a message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const subjectLabels: Record<string, string> = {
      registration: "Registration Query",
      books: "Study Books",
      competition: "Competition Details",
      partnership: "School Partnership",
      other: "Other",
    };

    const text = [
      `Hello Orchid SpellBee!`,
      ``,
      `*Name:* ${form.firstName} ${form.lastName}`.trim(),
      form.email ? `*Email:* ${form.email}` : null,
      `*Phone:* ${form.phone}`,
      form.subject ? `*Subject:* ${subjectLabels[form.subject] || form.subject}` : null,
      ``,
      `*Message:*`,
      form.message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    ((e.target as HTMLElement).style.borderColor = "var(--color-accent-orange)");
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    ((e.target as HTMLElement).style.borderColor = "#e2e8f0");

  return (
    <div className="page-layout" style={{ background: "#ffffff" }}>
      {/* Hero */}
      <div
        style={{
          padding: "10rem 3rem 7rem",
          background: "linear-gradient(135deg, #251c4d 0%, #1a1438 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", top: "-20%", left: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-30%", right: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "750px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.4rem 1.2rem", background: "rgba(255,184,0,0.15)",
              border: "1px solid rgba(255,184,0,0.3)", borderRadius: "30px",
              fontSize: "0.8rem", fontWeight: "700", color: "#ffb800",
              letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Get In Touch
          </div>
          <h1
            style={{
              fontSize: "4rem", fontWeight: "800", marginBottom: "1.5rem",
              lineHeight: "1.1", letterSpacing: "-1.5px",
              background: "linear-gradient(90deg, #ffffff 30%, #ffb800 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >
            Contact Us
          </h1>
          <p style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "rgba(255,255,255,0.75)" }}>
            Have a question about registrations, our books, or the competition? We're here to help.
            Reach out and our team will get back to you on WhatsApp.
          </p>
        </div>
      </div>

      {/* Contact Info + Form */}
      <div style={{ background: "#f8f9fa", padding: "7rem 0" }}>
        <div
          className="container"
          style={{
            maxWidth: "1100px", margin: "0 auto",
            display: "grid", gridTemplateColumns: "1fr 1.6fr",
            gap: "4rem", alignItems: "flex-start",
          }}
        >
          {/* Left — Info */}
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--color-text-heading)", marginBottom: "2rem" }}>
              We'd love to hear from you
            </h2>

            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                label: "Visit Us",
                lines: ["Orchid Spell Bee Private Limited", "XXI/152, Panadan Comazone,", "Cochin University P.O, Kalamassery", "Cochin, Kerala – 682 022"],
                color: "#ffb800",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12 19.79 19.79 0 0 1 1.14 3.36 2 2 0 0 1 3.12 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                label: "Call / WhatsApp",
                lines: ["756 09 97 700", "Mon–Sat: 10AM – 5PM"],
                color: "#25d366",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                label: "Email Us",
                lines: ["info@orchidspellbee.com"],
                color: "#0ea5e9",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex", gap: "1.25rem", marginBottom: "1.5rem",
                  padding: "1.75rem", background: "white", borderRadius: "18px",
                  border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "50px", height: "50px", borderRadius: "14px",
                    background: `${item.color}18`, color: item.color,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: "800", color: item.color, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "0.5rem" }}>
                    {item.label}
                  </div>
                  {item.lines.map((line, j) => (
                    <div key={j} style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: "1.8" }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* WhatsApp direct button */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                padding: "1rem", borderRadius: "14px", background: "#25d366",
                color: "white", fontWeight: "700", fontSize: "0.95rem",
                textDecoration: "none", boxShadow: "0 6px 20px rgba(37,211,102,0.3)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 25px rgba(37,211,102,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(37,211,102,0.3)";
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Chat with us on WhatsApp
            </a>

            {/* Social links */}
            <div style={{ marginTop: "2rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "1rem" }}>
                Follow Us
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[
                  { name: "Facebook", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                  { name: "Instagram", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                  { name: "YouTube", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
                ].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{ width: "44px", height: "44px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)", background: "white", transition: "all 0.2s ease", textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-accent-orange)"; (e.currentTarget as HTMLAnchorElement).style.color = "white"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-accent-orange)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "white"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-secondary)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0"; }}
                  >
                    {s.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div
            style={{
              background: "white", borderRadius: "24px", padding: "3rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--color-text-heading)", marginBottom: "0.5rem" }}>
              Send us a message
            </h3>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem", fontSize: "0.9rem" }}>
              Fill out the details below — clicking <strong>Send Message</strong> will open WhatsApp with your enquiry pre-filled.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "First Name *", field: "firstName", placeholder: "First Name" },
                  { label: "Last Name", field: "lastName", placeholder: "Last Name" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={form[field as keyof typeof form]}
                      onChange={set(field)}
                      style={{ ...inputStyle, borderColor: errors[field] ? "#ef4444" : "#e2e8f0" }}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                    {errors[field] && <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 600 }}>{errors[field]}</span>}
                  </div>
                ))}
              </div>

              {/* Email + Phone row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={form.phone}
                    onChange={set("phone")}
                    style={{ ...inputStyle, borderColor: errors.phone ? "#ef4444" : "#e2e8f0" }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  {errors.phone && <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 600 }}>{errors.phone}</span>}
                </div>
              </div>

              {/* Subject */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={labelStyle}>Subject</label>
                <select
                  value={form.subject}
                  onChange={set("subject")}
                  style={{ ...inputStyle, cursor: "pointer", color: form.subject ? "var(--color-text-heading)" : "var(--color-text-secondary)" }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                >
                  <option value="">Select a topic...</option>
                  <option value="registration">Registration Query</option>
                  <option value="books">Study Books</option>
                  <option value="competition">Competition Details</option>
                  <option value="partnership">School Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={set("message")}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    fontFamily: "inherit",
                    borderColor: errors.message ? "#ef4444" : "#e2e8f0",
                  }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                {errors.message && <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 600 }}>{errors.message}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: "100%", padding: "1rem",
                  borderRadius: "12px", border: "none",
                  background: "#25d366", color: "white",
                  fontWeight: "700", fontSize: "1rem",
                  cursor: "pointer", marginTop: "0.5rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  boxShadow: "0 6px 20px rgba(37,211,102,0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 25px rgba(37,211,102,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(37,211,102,0.3)"; }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Send via WhatsApp
              </button>

              <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--color-text-secondary)", margin: 0 }}>
                This will open WhatsApp with your details pre-filled. Fields marked * are required.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ width: "100%", height: "420px", position: "relative" }}>
        <iframe
          src="https://maps.google.com/maps?q=Cochin%20University%20P.O,%20Kalamassery,%20Cochin&t=&z=14&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(0.4)" }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Orchid SpellBee Office Location"
        />
        <div
          style={{
            position: "absolute", bottom: "2rem", left: "2rem",
            background: "white", borderRadius: "16px", padding: "1rem 1.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", gap: "0.75rem",
          }}
        >
          <div style={{ width: "40px", height: "40px", background: "rgba(255,184,0,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffb800" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "0.9rem", color: "var(--color-text-heading)" }}>Orchid SpellBee</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>Kalamassery, Cochin, Kerala</div>
          </div>
        </div>
      </div>
    </div>
  );
}
