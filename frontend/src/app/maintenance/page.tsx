"use client";

import { motion } from "framer-motion";

export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at center, #2e1065 0%, #1e1b4b 100%)",
      fontFamily: "var(--font-primary, sans-serif)",
      padding: "2rem",
      color: "#f8fafc",
      textAlign: "center",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Decorative ambient blobs */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "15%",
        width: "300px",
        height: "300px",
        background: "rgba(255, 184, 0, 0.15)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: "400px",
        height: "400px",
        background: "rgba(99, 102, 241, 0.15)",
        borderRadius: "50%",
        filter: "blur(100px)",
        pointerEvents: "none"
      }} />

      {/* Main glass card container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background: "rgba(30, 27, 75, 0.4)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "3.5rem 2.5rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Animated Icon/Logo Container */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "2rem",
            position: "relative"
          }}
        >
          {/* Outer glow ring */}
          <div style={{
            position: "absolute",
            width: "90px",
            height: "90px",
            background: "rgba(255, 184, 0, 0.2)",
            borderRadius: "50%",
            filter: "blur(15px)",
          }} />
          
          <div style={{
            background: "white",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            boxShadow: "0 8px 30px rgba(255, 184, 0, 0.3)",
            position: "relative",
            zIndex: 2
          }}>
            <img
              src="/img/logo.png"
              alt="Orchid SpellBee Logo"
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          marginBottom: "1rem",
          lineHeight: "1.2"
        }}>
          Scheduled <span style={{ color: "var(--color-accent-orange, #ffb800)" }}>Maintenance</span>
        </h1>

        {/* Description */}
        <p style={{
          fontSize: "1.1rem",
          color: "rgba(248, 250, 252, 0.8)",
          lineHeight: "1.7",
          marginBottom: "2rem",
          maxWidth: "480px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          We are currently upgrading our platform to bring you a faster and more exciting Orchid SpellBee competition experience. We will be back online shortly!
        </p>

        {/* Progress/Loading Indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          marginBottom: "2.5rem",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "0.75rem 1.25rem",
          borderRadius: "50px",
          width: "fit-content",
          margin: "0 auto 2.5rem auto",
          border: "1px solid rgba(255, 255, 255, 0.05)"
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{
              width: "18px",
              height: "18px",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              borderTopColor: "var(--color-accent-orange, #ffb800)",
              borderRadius: "50%"
            }}
          />
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.9)" }}>
            Upgrades in progress...
          </span>
        </div>

        {/* Action Button/Details */}
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(248, 250, 252, 0.5)", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>
            Need Immediate Support?
          </p>
          <a
            id="maintenance-support-link"
            href="mailto:support@orchidspellbee.com"
            style={{
              color: "var(--color-accent-orange, #ffb800)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              transition: "opacity 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            support@orchidspellbee.com
          </a>
        </div>
      </motion.div>

      {/* Footer copyright */}
      <footer style={{
        marginTop: "3rem",
        fontSize: "0.85rem",
        color: "rgba(248, 250, 252, 0.4)",
        zIndex: 1
      }}>
        &copy; {new Date().getFullYear()} Orchid SpellBee. All rights reserved.
      </footer>
    </div>
  );
}
