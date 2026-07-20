"use client";

import { motion } from "framer-motion";

const prizes = [
  {
    level: "School Level",
    color: "#34d399",
    bgClass: "linear-gradient(145deg, #064e3b, #022c22)",
    borderColor: "rgba(16,185,129,0.3)",
    shadowColor: "rgba(16,185,129,0.3)",
    fee: "₹100",
    includesTextbook: true,
    data: [
      { rank: "1ST PRIZE:", detail: "MEMENTO + CERTIFICATE" },
      { rank: "2ND PRIZE:", detail: "MEMENTO + CERTIFICATE" },
    ],
  },
  {
    level: "District Level",
    color: "#c4b5fd",
    bgClass: "linear-gradient(145deg, #4c1d95, #2e1065)",
    borderColor: "rgba(124,58,237,0.3)",
    shadowColor: "rgba(124,58,237,0.3)",
    fee: "₹500",
    includesTextbook: true,
    data: [
      { rank: "1ST PRIZE:", detail: "₹5,000/- + MEMENTO + CERTIFICATE" },
      { rank: "2ND PRIZE:", detail: "₹3,000/- + MEMENTO + CERTIFICATE" },
      { rank: "3RD PRIZE:", detail: "₹1,500/- + MEMENTO + CERTIFICATE" },
      { rank: "4TH PRIZE:", detail: "₹1,000/- + MEMENTO + CERTIFICATE" },
      { rank: "5TH PRIZE:", detail: "₹750/- + MEMENTO + CERTIFICATE" },
      { rank: "6TH - 10TH PRIZE:", detail: "₹500/- + MEMENTO + CERTIFICATE" },
    ],
  },
  {
    level: "State Level",
    color: "#7dd3fc",
    bgClass: "linear-gradient(145deg, #0c4a6e, #082f49)",
    borderColor: "rgba(14,165,233,0.3)",
    shadowColor: "rgba(14,165,233,0.3)",
    fee: "₹1000",
    includesTextbook: true,
    data: [
      { rank: "1ST PRIZE:", detail: "₹15,000/- + MEMENTO + CERTIFICATE" },
      { rank: "2ND PRIZE:", detail: "₹10,000/- + MEMENTO + CERTIFICATE" },
      { rank: "3RD PRIZE:", detail: "₹5,000/- + MEMENTO + CERTIFICATE" },
      { rank: "4TH PRIZE:", detail: "₹3,000/- + MEMENTO + CERTIFICATE" },
      { rank: "5TH PRIZE:", detail: "₹2,000/- + MEMENTO + CERTIFICATE" },
      { rank: "6TH - 10TH PRIZE:", detail: "₹1,000/- + MEMENTO + CERTIFICATE" },
    ],
  },
  {
    level: "National Level",
    color: "#f8fafc",
    bgClass: "linear-gradient(145deg, #1e1b4b, #0f172a)",
    borderColor: "rgba(76,58,153,0.5)",
    shadowColor: "rgba(76,58,153,0.4)",
    fee: "₹2000",
    includesTextbook: false,
    data: [
      { rank: "1ST PRIZE:", detail: "₹25,000/- + MEMENTO + CERTIFICATE" },
      { rank: "2ND PRIZE:", detail: "₹20,000/- + MEMENTO + CERTIFICATE" },
      { rank: "3RD PRIZE:", detail: "₹15,000/- + MEMENTO + CERTIFICATE" },
      { rank: "4TH PRIZE:", detail: "₹10,000/- + MEMENTO + CERTIFICATE" },
      { rank: "5TH PRIZE:", detail: "₹5,000/- + MEMENTO + CERTIFICATE" },
      { rank: "6TH - 10TH PRIZE:", detail: "₹2,000/- + MEMENTO + CERTIFICATE" },
    ],
  },
];

const Card = ({ prize, index }: { prize: (typeof prizes)[0]; index: number }) => {
  return (
    <div
      style={{
        position: 'sticky',
        top: `${120 + index * 40}px`,
        width: "100%",
        maxWidth: "420px",
        height: "500px",
        margin: "0 auto",
        marginBottom: "60vh",
        zIndex: index + 1,
        willChange: "transform",
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <div style={{ 
          background: prize.bgClass, 
          borderRadius: '20px', 
          padding: '1.8rem 1.5rem', 
          position: 'relative', 
          zIndex: 2, 
          color: 'white', 
          boxShadow: `0 -15px 35px -10px rgba(0,0,0,0.5)`, 
          border: `1px solid ${prize.borderColor}`, 
          borderTop: `1px solid rgba(255,255,255,0.2)`,
          height: "100%", 
          display: "flex", 
          flexDirection: "column" 
        }}>
          <h4 style={{ color: prize.color, textAlign: 'center', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{prize.level}</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px', flexGrow: 1 }}>
            <tbody>
              {prize.data.map((p, i) => (
                <tr key={i}>
                  <td style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 0.4rem', color: 'white', width: '40%' }}>{p.rank}</td>
                  <td style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 0.4rem', color: 'rgba(255,255,255,0.8)', textAlign: 'right' }}>{p.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center", fontStyle: "italic", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginTop: 'auto', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px' }}>
             Registration Fee: <b style={{ color: 'white' }}>{prize.fee}</b> <br/>{prize.includesTextbook && <span style={{ fontSize: '0.75rem' }}>(Includes textbook)</span>}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function PrizeScrollSection() {
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '10vh' }}>
      {prizes.map((prize, i) => (
        <Card prize={prize} index={i} key={i} />
      ))}
    </div>
  );
}
