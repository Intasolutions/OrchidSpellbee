"use client";

import Link from "next/link";

export default function RoundsAndPrizesPage() {
  const rounds = [
    {
      num: "01",
      name: "School Level",
      type: "Written Test",
      desc: "The journey begins with a written spelling examination at your own school. Students are tested on a curated word list, and the top performers qualify for the next round.",
      color: "#ffb800",
      bgLight: "rgba(255,184,0,0.08)",
    },
    {
      num: "02",
      name: "Zonal Level",
      type: "Written + Oral",
      desc: "Qualifiers from multiple schools compete at the zonal level. The oral rounds begin here — spelling words aloud before a panel of judges in a live competitive setting.",
      color: "#7c3aed",
      bgLight: "rgba(124,58,237,0.08)",
    },
    {
      num: "03",
      name: "State Level",
      type: "Oral Rounds",
      desc: "The state's finest spellers face elimination-style oral rounds. Words grow in complexity, drawing from academic, literary, and scientific vocabulary.",
      color: "#0ea5e9",
      bgLight: "rgba(14,165,233,0.08)",
    },
    {
      num: "04",
      name: "National Grand Finale",
      type: "Grand Finale",
      desc: "The pinnacle of the Orchid Spell Bee. National champions from every state compete on a grand stage before thousands of spectators, battling for glory and life-changing prizes.",
      color: "#f97316",
      bgLight: "rgba(249,115,22,0.08)",
    },
  ];

  const nationalPrizes = [
    {
      rank: "1st Prize",
      amount: "₹25,000",
      extras: "Trophy + Certificate + Medal",
      highlight: true,
    },
    {
      rank: "2nd Prize",
      amount: "₹20,000",
      extras: "Trophy + Certificate + Medal",
      highlight: false,
    },
    {
      rank: "3rd Prize",
      amount: "₹15,000",
      extras: "Trophy + Certificate",
      highlight: false,
    },
    {
      rank: "4th Prize",
      amount: "₹10,000",
      extras: "Memento + Certificate",
      highlight: false,
    },
    {
      rank: "5th Prize",
      amount: "₹5,000",
      extras: "Memento + Certificate",
      highlight: false,
    },
    {
      rank: "6th – 10th",
      amount: "₹2,000",
      extras: "Memento + Certificate",
      highlight: false,
    },
  ];

  const statePrizes = [
    { rank: "1st", amount: "₹5,000", extras: "Trophy + Certificate" },
    { rank: "2nd", amount: "₹3,000", extras: "Trophy + Certificate" },
    { rank: "3rd", amount: "₹2,000", extras: "Trophy + Certificate" },
    { rank: "4th – 10th", amount: "₹1,000", extras: "Certificate" },
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
            bottom: "-30%",
            right: "5%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(255,56,92,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255,184,0,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "800px",
            margin: "0 auto",
          }}
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
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            Prizes &amp; Recognition
          </div>
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
            Rounds & Prizes
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            From school hallways to national stages — every step of the Orchid
            Spell Bee journey is rewarded with recognition, prizes, and
            unforgettable memories.
          </p>
        </div>
      </div>

      {/* Competition Path */}
      <div style={{ background: "#f8f9fa", padding: "7rem 0" }}>
        <div
          className="container"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--color-text-heading)",
                marginBottom: "1rem",
              }}
            >
              The Competition Path
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
              display: "flex",
              flexDirection: "column",
              position: "relative",
              gap: "0",
            }}
          >
            {/* Vertical connector line */}
            <div
              style={{
                position: "absolute",
                left: "43px",
                top: "60px",
                bottom: "60px",
                width: "2px",
                background:
                  "linear-gradient(to bottom, #ffb800, #7c3aed, #0ea5e9, #f97316)",
                zIndex: 0,
              }}
            />

            {rounds.map((round, i) => (
              <div
                key={i}
                className="fade-up round-row"
                style={{
                  display: "flex",
                  gap: "2.5rem",
                  alignItems: "flex-start",
                  marginBottom: i < rounds.length - 1 ? "3rem" : "0",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Number circle */}
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    borderRadius: "50%",
                    background: round.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    fontWeight: "900",
                    color: "white",
                    flexShrink: 0,
                    boxShadow: `0 8px 25px ${round.color}55`,
                    border: "4px solid white",
                  }}
                >
                  {round.num}
                </div>

                {/* Content card */}
                <div
                  style={{
                    flex: 1,
                    background: "white",
                    borderRadius: "20px",
                    padding: "2rem 2.5rem",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border: `1px solid ${round.color}30`,
                    borderLeft: `5px solid ${round.color}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "800",
                        color: "var(--color-text-heading)",
                        margin: 0,
                      }}
                    >
                      {round.name}
                    </h3>
                    <span
                      style={{
                        padding: "0.35rem 1rem",
                        background: round.bgLight,
                        color: round.color,
                        borderRadius: "20px",
                        fontWeight: "700",
                        fontSize: "0.8rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {round.type}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      lineHeight: "1.75",
                      margin: 0,
                    }}
                  >
                    {round.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prize Tables */}
      <div style={{ background: "white", padding: "7rem 0" }}>
        <div
          className="container"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--color-text-heading)",
                marginBottom: "1rem",
              }}
            >
              Prize Distribution
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
            className="prize-tables-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* National Prizes */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(249,115,22,0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "rgba(249,115,22,0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
                </div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "800",
                    color: "var(--color-text-heading)",
                    margin: 0,
                  }}
                >
                  National Level
                </h3>
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg, #251c4d, #1a1438)",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                {nationalPrizes.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.2rem 2rem",
                      borderBottom:
                        i < nationalPrizes.length - 1
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                      background:
                        i === 0 ? "rgba(255,184,0,0.12)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background:
                            i === 0
                              ? "#ffb800"
                              : i === 1
                              ? "rgba(255,255,255,0.15)"
                              : i === 2
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(255,255,255,0.05)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          color: i === 0 ? "#251c4d" : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div
                          style={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                          }}
                        >
                          {p.rank}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {p.extras}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "800",
                        color: i === 0 ? "#ffb800" : "white",
                      }}
                    >
                      {p.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State Prizes */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(14,165,233,0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "rgba(14,165,233,0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
                </div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "800",
                    color: "var(--color-text-heading)",
                    margin: 0,
                  }}
                >
                  State Level
                </h3>
              </div>
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                }}
              >
                {statePrizes.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.4rem 2rem",
                      borderBottom:
                        i < statePrizes.length - 1
                          ? "1px solid #e2e8f0"
                          : "none",
                      background: "white",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "rgba(14,165,233,0.1)",
                          color: "#0ea5e9",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: "800",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div
                          style={{
                            color: "var(--color-text-heading)",
                            fontWeight: "700",
                          }}
                        >
                          {p.rank}
                        </div>
                        <div
                          style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {p.extras}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "800",
                        color: "#0ea5e9",
                      }}
                    >
                      {p.amount}
                    </div>
                  </div>
                ))}
              </div>

              {/* All participants note */}
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  background: "rgba(255,184,0,0.08)",
                  border: "1px solid rgba(255,184,0,0.25)",
                  borderRadius: "14px",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(255,184,0,0.15)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "var(--color-text-heading)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Every Participant is a Winner
                  </div>
                  <div
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                    }}
                  >
                    All registered students receive a participation certificate.
                    School-level qualifiers receive special merit awards.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
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
            left: "10%",
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
            Start Your Spelling Journey
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2.5rem",
              fontSize: "1.05rem",
            }}
          >
            Register for the school level today — your path to national glory
            begins with a single word.
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
    </div>
  );
}
