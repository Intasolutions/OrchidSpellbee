"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Custom Interactive Value Card Component for Core Values section
interface ValueCardProps {
  v: {
    icon: React.ReactElement;
    title: string;
    desc: string;
    bg: string;
    themeColor: string;
    borderColor: string;
    glowColor: string;
    shadowColor: string;
  };
}

function ValueCard({ v }: ValueCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #fafafc 100%)",
        borderRadius: "24px",
        padding: "2.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxShadow: hovered 
          ? `0 20px 40px rgba(30, 27, 75, 0.06), 0 10px 24px ${v.shadowColor}`
          : "0 8px 30px rgba(30, 27, 75, 0.02), 0 1px 3px rgba(30, 27, 75, 0.01)",
        border: "1px solid",
        borderColor: hovered ? v.borderColor : "rgba(30, 27, 75, 0.05)",
        transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
        overflow: "hidden",
        minHeight: "260px",
        justifyContent: "center"
      }}
    >
      {/* Soft background glow */}
      <div 
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `radial-gradient(circle at center, ${v.glowColor} 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      
      {/* Icon block */}
      <div
        style={{
          width: "72px",
          height: "72px",
          background: hovered ? v.themeColor : v.bg,
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
          flexShrink: 0,
          transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: hovered ? `0 10px 20px ${v.shadowColor}` : "none",
          zIndex: 1
        }}
      >
        {React.cloneElement(v.icon, { stroke: hovered ? "#ffffff" : v.themeColor } as any)}
      </div>
      
      {/* Title & Desc */}
      <div style={{ zIndex: 1 }}>
        <h4
          style={{
            fontSize: "1.2rem",
            fontWeight: "800",
            color: "var(--color-text-heading)",
            marginBottom: "0.75rem",
            letterSpacing: "-0.5px"
          }}
        >
          {v.title}
        </h4>
        <p
          style={{
            fontSize: "0.92rem",
            color: "var(--color-text-secondary)",
            lineHeight: "1.6",
            margin: 0,
            maxWidth: "260px"
          }}
        >
          {v.desc}
        </p>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const team = [
    {
      name: "Founder & Director",
      color: "#ffb800",
      bgLight: "rgba(255,184,0,0.1)",
      bio: "With over 20 years in education, our founder established Orchid Spell Bee to bring structured linguistic excellence to every student in Kerala.",
      expertise: ["Education Leadership", "Curriculum Design", "Public Speaking"],
    },
    {
      name: "Chief Education Officer",
      color: "#7c3aed",
      bgLight: "rgba(124,58,237,0.1)",
      bio: "A passionate linguist and former national spelling bee champion, our Chief Education Officer oversees all academic content and word list curation.",
      expertise: ["Linguistics", "Word Curation", "Student Coaching"],
    },
    {
      name: "Head of Competitions",
      color: "#0ea5e9",
      bgLight: "rgba(14,165,233,0.1)",
      bio: "Our Head of Competitions manages the end-to-end logistics of all competition tiers, ensuring a fair, smooth, and memorable experience for every participant.",
      expertise: ["Event Management", "Operations", "Judging Protocols"],
    },
    {
      name: "Curriculum Director",
      color: "#10b981",
      bgLight: "rgba(16,185,129,0.1)",
      bio: "Our Curriculum Director leads the development of our study books and teaching aids, combining modern pedagogy with proven spelling techniques.",
      expertise: ["Pedagogy", "Book Authoring", "Teacher Training"],
    },
    {
      name: "Technology Lead",
      color: "#f97316",
      bgLight: "rgba(249,115,22,0.1)",
      bio: "Our Technology Lead builds and maintains the digital platforms that power our registration, scoring, and communication systems.",
      expertise: ["Web Development", "Systems Design", "Data Analytics"],
    },
    {
      name: "Events Coordinator",
      color: "#ec4899",
      bgLight: "rgba(236,72,153,0.1)",
      bio: "Our Events Coordinator ensures every event is an experience — from the décor and stage setup to participant hospitality and awards ceremonies.",
      expertise: ["Event Planning", "Hospitality", "Communications"],
    },
  ];

  const values = [
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      title: "Education First",
      desc: "Every decision we make is rooted in what's best for the student's growth.",
      bg: "rgba(124,58,237,0.08)",
      themeColor: "#7c3aed",
      borderColor: "rgba(124,58,237,0.25)",
      glowColor: "rgba(124,58,237,0.12)",
      shadowColor: "rgba(124,58,237,0.15)",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      title: "Integrity",
      desc: "Fair, transparent, and consistent in all our competitions and operations.",
      bg: "rgba(14,165,233,0.08)",
      themeColor: "#0ea5e9",
      borderColor: "rgba(14,165,233,0.25)",
      glowColor: "rgba(14,165,233,0.12)",
      shadowColor: "rgba(14,165,233,0.15)",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "Excellence",
      desc: "We hold ourselves and our participants to the highest standards.",
      bg: "rgba(255,184,0,0.08)",
      themeColor: "#ffb800",
      borderColor: "rgba(255,184,0,0.25)",
      glowColor: "rgba(255,184,0,0.12)",
      shadowColor: "rgba(255,184,0,0.15)",
    },
    {
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V12" />
          <path d="M12 12C12 8 15 5 19 5c0 4-2 7-7 7z" />
          <path d="M12 12C12 8 9 5 5 5c0 4 2 7 7 7z" />
        </svg>
      ),
      title: "Nurturing",
      desc: "We build confidence and love of learning, not just spelling skills.",
      bg: "rgba(16,185,129,0.08)",
      themeColor: "#10b981",
      borderColor: "rgba(16,185,129,0.25)",
      glowColor: "rgba(16,185,129,0.12)",
      shadowColor: "rgba(16,185,129,0.15)",
    },
  ];

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
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "0%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          className="container"
          style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}
        >
          <div
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
              textTransform: "uppercase" as const,
              marginBottom: "2rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            The People Behind It All
          </div>
          <h1
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
            Meet Our Team
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            A dedicated group of educators, linguists, and organisers united by a single
            mission — to inspire a generation of confident, articulate young minds.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div style={{ background: "#f8f9fa", padding: "6rem 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Section Header */}
          <div className="reveal-up" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1.2rem",
                background: "rgba(255,184,0,0.1)",
                border: "1px solid rgba(255,184,0,0.2)",
                borderRadius: "30px",
                fontSize: "0.8rem",
                fontWeight: "700",
                color: "var(--color-accent-orange-hover)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Core Values
            </div>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--color-text-heading)",
                margin: 0,
              }}
            >
              What Guides Us
            </h2>
            <div
              style={{
                width: "50px",
                height: "3px",
                background: "var(--color-accent-orange)",
                margin: "1rem auto 0 auto",
                borderRadius: "2px"
              }}
            />
          </div>

          <div
            className="reveal-up"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            {values.map((v, i) => (
              <ValueCard key={i} v={v} />
            ))}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div style={{ padding: "7rem 0", background: "white" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal-up" style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--color-text-heading)",
                marginBottom: "1rem",
              }}
            >
              Leadership Team
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
            }}
          >
            {team.map((member, i) => (
              <div
                key={i}
                className={`reveal-up delay-${(i % 3) * 100 + 100}`}
                style={{
                  background: "white",
                  border: "1px solid #f0f0f0",
                  borderRadius: "24px",
                  padding: "2.5rem",
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 15px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "20px",
                    background: member.bgLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: `2px solid ${member.color}33`,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={member.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: "800",
                      color: "var(--color-text-heading)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: "1.65",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {member.expertise.map((tag, j) => (
                      <span
                        key={j}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: member.bgLight,
                          color: member.color,
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join the Team CTA */}
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
            background: "radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "rgba(255,184,0,0.12)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "2.5rem",
              color: "white",
              fontWeight: "800",
              marginBottom: "1rem",
            }}
          >
            Want to Join Our Mission?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2.5rem",
              fontSize: "1.05rem",
              maxWidth: "550px",
              margin: "0 auto 2.5rem auto",
            }}
          >
            We're always looking for passionate educators, volunteers, and professionals
            to help shape the next generation of spelling champions.
          </p>
          <Link href="/contact" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <button
              className="btn"
              style={{
                fontSize: "1rem",
                padding: "1rem 2.5rem",
                borderRadius: "50px",
                cursor: "pointer",
              }}
            >
              Get In Touch →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
