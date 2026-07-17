"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

// Professional SVG icons for each level
const SchoolIcon = ({ size = 28, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ZonalIcon = ({ size = 28, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);
const StateIcon = ({ size = 28, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const TrophyIcon = ({ size = 28, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isRegistrationActive, setIsRegistrationActive] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/`)
      .then(res => res.json())
      .then(data => setIsRegistrationActive(data.is_registration_active))
      .catch(() => setIsRegistrationActive(true));
  }, []);

  const levels = [
    {
      id: 0,
      name: "School Level",
      Icon: SchoolIcon,
      badge: "Level 01",
      color: "#ffb800",
      bgLight: "rgba(255,184,0,0.08)",
      format: "Written Test",
      duration: "30 Minutes",
      fee: "₹500",
      desc: "The gateway to the Orchid Spell Bee journey. Students demonstrate their foundational spelling and vocabulary skills through a structured written examination.",
      details: [
        "Multiple-choice spelling questions",
        "Fill-in-the-blank vocabulary section",
        "Word origin and etymology basics",
        "Top 20% advance to District Level",
      ],
    },
    {
      id: 1,
      name: "District Level",
      Icon: ZonalIcon,
      badge: "Level 02",
      color: "#7c3aed",
      bgLight: "rgba(124,58,237,0.08)",
      format: "Written",
      duration: "2 Hours",
      fee: "Free (Qualified)",
      desc: "Competitors who clear the school round face tougher challenges here. The introduction of rigorous written formats begins, testing their verbal command of spelling.",
      details: [
        "Advanced written spelling test",
        "Vocabulary and definition matching",
        "Pronunciation and diction scoring",
        "Top 15% advance to State Level",
      ],
    },
    {
      id: 2,
      name: "State Level",
      Icon: StateIcon,
      badge: "Level 03",
      color: "#0ea5e9",
      bgLight: "rgba(14,165,233,0.08)",
      format: "Written + Oral",
      duration: "Full Day Event",
      fee: "Free (Qualified)",
      desc: "A prestige event bringing together the state's finest spellers. The competition intensifies with complex word sets drawn from academic and literary sources.",
      details: [
        "Elimination-style oral rounds",
        "Advanced written examination",
        "Etymology and language of origin",
        "State Champions advance to National",
      ],
    },
    {
      id: 3,
      name: "National Level",
      Icon: TrophyIcon,
      badge: "Level 04",
      color: "#f97316",
      bgLight: "rgba(249,115,22,0.08)",
      format: "Written + Oral",
      duration: "2-Day Event",
      fee: "Free (Qualified)",
      desc: "The ultimate stage. Champions from across India battle for national glory, with prizes totaling over ₹1,00,000 and lifetime recognition.",
      details: [
        "Elite oral spelling championship",
        "Words from international dictionaries",
        "Live-streamed before thousands",
        "Cash prizes + trophies + certificates",
      ],
    },
  ];

  const stats = [
    { value: "10,000+", label: "Participants Annually" },
    { value: "4", label: "Competition Tiers" },
    { value: "₹1L+", label: "Total Prize Pool" },
    { value: "50+", label: "Districts Covered" },
  ];

  return (
    <div className="page-layout" style={{ background: "#ffffff" }}>
      {/* Hero Section */}
      <div
        style={{
          padding: "10rem 3rem 7rem",
          background: "linear-gradient(135deg, #251c4d 0%, #1a1438 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "15%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(255,184,0,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            className="animate-reveal-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1.2rem",
              background: "rgba(255,184,0,0.15)",
              border: "1px solid rgba(255,184,0,0.3)",
              borderRadius: "30px",
              fontSize: "0.8rem",
              fontWeight: "700",
              color: "#ffb800",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            Competition Structure
          </div>

          <h1
            className="animate-reveal-up delay-100"
            style={{
              fontSize: "4rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
              background: "linear-gradient(90deg, #ffffff 30%, #ffb800 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Four Tiers. One Champion.
          </h1>
          <p
            className="animate-reveal-up delay-200"
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
              maxWidth: "650px",
              margin: "0 auto",
            }}
          >
            The competition features a progressive four-tier structure. Advancement to each subsequent stage is contingent upon qualifying in the preceding round:
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #f0f0f0",
          padding: "2.5rem 0",
        }}
      >
        <div
          className="container stats-grid reveal-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  color: "var(--color-text-heading)",
                  marginBottom: "0.3rem",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-secondary)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Selector + Detail Panel */}
      <div
        style={{ background: "#f8f9fa", padding: "6rem 0" }}
      >
        <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
          {/* New Assessment & Awards Section */}
          <div className="reveal-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "5rem" }}>
            
            {/* Assessment Format */}
            <div style={{ background: "white", padding: "2.5rem", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-heading)", marginBottom: "1.5rem" }}>Assessment Format</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-accent-orange)", marginBottom: "0.5rem" }}>School & District Levels</h4>
                <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", margin: 0 }}>Participants will undergo a standardized written examination.</p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-accent-orange)", marginBottom: "0.5rem" }}>State & National Levels</h4>
                <ul style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", paddingLeft: "1.2rem", margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Phase 1 (Written Test):</strong> All qualifying candidates from the previous tier will sit for a preliminary written examination.</li>
                  <li><strong>Phase 2 (Oral Rounds):</strong> Selected candidates who successfully pass the written test will advance to compete in the live oral evaluation rounds.</li>
                </ul>
              </div>
            </div>

            {/* Awards & Recognitions */}
            <div style={{ background: "white", padding: "2.5rem", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-heading)", marginBottom: "1.5rem" }}>Awards & Recognitions</h3>
              <p style={{ color: "var(--color-text-secondary)", fontWeight: 700, marginBottom: "1rem" }}>Tiered Rewards Summary</p>
              <ul style={{ color: "var(--color-text-secondary)", lineHeight: "1.8", listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}><span style={{ color: "var(--color-accent-orange)" }}>✓</span> <span><strong>School Level:</strong> Memento & Certificate of Participation</span></li>
                <li style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}><span style={{ color: "var(--color-accent-orange)" }}>✓</span> <span><strong>District Level:</strong> Cash Award, Memento & Certificate</span></li>
                <li style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}><span style={{ color: "var(--color-accent-orange)" }}>✓</span> <span><strong>State Level:</strong> Cash Award, Memento & Certificate</span></li>
                <li style={{ display: "flex", gap: "0.5rem" }}><span style={{ color: "var(--color-accent-orange)" }}>✓</span> <span><strong>National Level:</strong> Cash Award, Medal, Memento & Certificate</span></li>
              </ul>
            </div>

          </div>

          <div className="reveal-up" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--color-text-heading)",
                marginBottom: "1rem",
              }}
            >
              Explore Each Round
            </h2>
            <div
              style={{
                width: "60px",
                height: "4px",
                background: "var(--color-accent-orange)",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Tab Buttons */}
          <div
            className="reveal-up"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "3rem",
              flexWrap: "wrap",
            }}
          >
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setActiveTab(level.id)}
                style={{
                  padding: "0.75rem 1.8rem",
                  borderRadius: "50px",
                  border: `2px solid ${activeTab === level.id ? level.color : "transparent"}`,
                  background: activeTab === level.id ? level.bgLight : "white",
                  color: activeTab === level.id ? level.color : "var(--color-text-secondary)",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <level.Icon size={16} color={activeTab === level.id ? level.color : "var(--color-text-secondary)"} />
                {level.name}
              </button>
            ))}
          </div>

          {/* Active Panel */}
          {levels.map(
            (level) =>
              activeTab === level.id && (
                <div
                  key={level.id}
                  className="comp-detail-panel reveal-up"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "3rem",
                    background: "white",
                    borderRadius: "24px",
                    padding: "3rem",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  {/* Left */}
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "0.3rem 1rem",
                        background: level.bgLight,
                        color: level.color,
                        borderRadius: "20px",
                        fontWeight: "800",
                        fontSize: "0.8rem",
                        letterSpacing: "1px",
                        marginBottom: "1.5rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {level.badge}
                    </div>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        background: level.bgLight,
                        border: `2px solid ${level.color}33`,
                        borderRadius: "22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <level.Icon size={38} color={level.color} />
                    </div>
                    <h3
                      style={{
                        fontSize: "2rem",
                        fontWeight: "800",
                        color: "var(--color-text-heading)",
                        marginBottom: "1rem",
                      }}
                    >
                      {level.name}
                    </h3>
                    <p
                      style={{
                        color: "var(--color-text-secondary)",
                        lineHeight: "1.8",
                        marginBottom: "2rem",
                      }}
                    >
                      {level.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        { label: "Format", val: level.format },
                        { label: "Duration", val: level.duration },
                      ].map((info, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#f8f9fa",
                            padding: "0.75rem 1.25rem",
                            borderRadius: "12px",
                            flex: "1",
                            minWidth: "100px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--color-text-secondary)",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              marginBottom: "0.3rem",
                            }}
                          >
                            {info.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "var(--color-text-heading)",
                              fontWeight: "700",
                            }}
                          >
                            {info.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — Details List */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "1.25rem",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "800",
                        color: "var(--color-text-heading)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      What to Expect
                    </h4>
                    {level.details.map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "1rem",
                          padding: "1.25rem",
                          background: level.bgLight,
                          borderRadius: "14px",
                          border: `1px solid ${level.color}22`,
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            background: level.color,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span
                          style={{
                            color: "var(--color-text-heading)",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            lineHeight: "1.5",
                          }}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {/* CTA Section */}
      {isRegistrationActive && (
        <div
          style={{
            background: "linear-gradient(135deg, #251c4d 0%, #1a1438 100%)",
          padding: "6rem 3rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "2.5rem",
              color: "white",
              fontWeight: "800",
              marginBottom: "1rem",
            }}
          >
            Ready to Begin Your Journey?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2.5rem",
              fontSize: "1.1rem",
            }}
          >
            Register today and take the first step towards becoming a national
            spelling champion.
          </p>
          <Link href="/?register=true" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <button
              className="btn"
              style={{
                fontSize: "1.05rem",
                padding: "1rem 3rem",
                borderRadius: "50px",
                cursor: "pointer",
              }}
            >
              Register Now →
            </button>
          </Link>
        </div>
      </div>
      )}
    </div>
  );
}
