"use client";

import Image from "next/image";
import Link from "next/link";

export default function OurBooksPage() {
  const books = [
    {
      title: "Junior Spelling Guide",
      level: "Classes 1 – 3",
      image: "/img/01.png",
      color: "#ffb800",
      bgLight: "rgba(255,184,0,0.08)",
      borderColor: "rgba(255,184,0,0.25)",
      pages: "180 Pages",
      words: "500+ Words",
      topics: ["Basic phonics & spelling rules", "Simple vocabulary lists", "Fun practice exercises", "Illustrated word stories"],
      desc: "The perfect launchpad for young spellers. Packed with colourful illustrations, phonics-based exercises, and 500+ carefully chosen words to build a strong foundation.",
    },
    {
      title: "Intermediate Vocab Builder",
      level: "Classes 4 – 6",
      image: "/img/02.png",
      color: "#7c3aed",
      bgLight: "rgba(124,58,237,0.08)",
      borderColor: "rgba(124,58,237,0.25)",
      pages: "240 Pages",
      words: "1,200+ Words",
      topics: ["Etymology & word roots", "Grammar integration", "Contextual usage", "Mock test papers"],
      desc: "Designed for intermediate learners, this guide bridges basic spelling with advanced vocabulary. Students develop a deeper understanding of word patterns and origins.",
    },
    {
      title: "Advanced Linguistic Mastery",
      level: "Classes 7 – 9",
      image: "/img/03.png",
      color: "#0ea5e9",
      bgLight: "rgba(14,165,233,0.08)",
      borderColor: "rgba(14,165,233,0.25)",
      pages: "310 Pages",
      words: "2,500+ Words",
      topics: ["Latin & Greek roots", "Complex word structures", "State-level word bank", "Timed practice rounds"],
      desc: "The comprehensive guide for serious competitors. Covers over 2,500 words drawn from academic, scientific, and literary sources at the state-competition level.",
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
            left: "-5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "10%",
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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Study Materials
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
            Our Study Books
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Meticulously crafted by our expert linguists, our study books are the definitive
            companion for every Orchid Spell Bee participant — from beginners to national champions.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ background: "#f8f9fa", padding: "3rem 0", borderBottom: "1px solid #e2e8f0" }}>
        <div
          className="container stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          {[
            { val: "3", label: "Books in Series" },
            { val: "27,000+", label: "Total Words Covered" },
            { val: "Expert", label: "Curated Content" },
            { val: "All Levels", label: "Classes 1 - 9" },
          ].map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  color: "var(--color-text-heading)",
                  marginBottom: "0.3rem",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-text-secondary)",
                  fontWeight: "600",
                  textTransform: "uppercase" as const,
                  letterSpacing: "1px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Books Grid */}
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
              The Complete Series
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
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {books.map((book, i) => (
              <div
                key={i}
                className={`reveal-up card delay-${(i % 4) * 100 + 100}`}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  border: `1px solid ${book.borderColor}`,
                  padding: "0",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Book Cover */}
                <div
                  style={{
                    background: book.bgLight,
                    padding: "3rem 2rem",
                    textAlign: "center",
                    borderBottom: `1px solid ${book.borderColor}`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      background: book.color,
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {book.level}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "2048/1151",
                      margin: "1.5rem auto 1rem auto",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "white"
                    }}
                  >
                    <Image 
                      src={book.image} 
                      alt={book.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: book.color,
                      fontWeight: "700",
                    }}
                  >
                    {book.pages} &nbsp;·&nbsp; {book.words}
                  </div>
                </div>

                {/* Book Info */}
                <div style={{ padding: "2rem" }}>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "800",
                      color: "var(--color-text-heading)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.9rem",
                      lineHeight: "1.7",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {book.desc}
                  </p>

                  {/* Topics */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
                    {book.topics.map((topic, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          fontSize: "0.85rem",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            background: `${book.color}22`,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={book.color}
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        {topic}
                      </div>
                    ))}
                  </div>

                  <button
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      background: "transparent",
                      border: `2px solid ${book.color}`,
                      color: book.color,
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.background = book.bgLight;
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    Preview Book →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
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
          <h2
            style={{ fontSize: "2.5rem", color: "white", fontWeight: "800", marginBottom: "1rem" }}
          >
            Get Your Study Books Today
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2.5rem",
              fontSize: "1.05rem",
            }}
          >
            Available through your school coordinator or directly from our office in Cochin.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <button
                className="btn"
                style={{ fontSize: "1rem", padding: "1rem 2.5rem", borderRadius: "50px", cursor: "pointer" }}
              >
                Order Now →
              </button>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <button
                className="btn btn-outline"
                style={{
                  fontSize: "1rem",
                  padding: "1rem 2.5rem",
                  borderRadius: "50px",
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
