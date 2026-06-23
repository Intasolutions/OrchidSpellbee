"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "./actions";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((data) => {
      if (data && !data.error) {
        setStats(data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", color: "#64748b" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "30px", height: "30px", border: "3px solid #e2e8f0", borderTopColor: "var(--color-accent-orange)", borderRadius: "50%", margin: "0 auto 1rem auto", animation: "spin 1s linear infinite" }}></div>
          <p style={{ fontWeight: 600 }}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: "2rem", background: "#fecaca", color: "#b91c1c", borderRadius: "12px", border: "1px solid #fee2e2" }}>
        <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>Error Loading Dashboard</h3>
        <p style={{ margin: 0 }}>Could not retrieve administrative stats. Make sure backend server is active.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Dashboard Overview</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>Overview of registrations, dynamic tiers, and student progression stats.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
        {/* Card 1: Total Registrations */}
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Registrations</span>
            <div style={{ background: "rgba(255, 184, 0, 0.1)", color: "var(--color-accent-orange-hover)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{stats.total_submissions}</h3>
          <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginTop: "0.5rem" }}>Total form applications</span>
        </div>

        {/* Card 2: Successful Payments */}
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Paid Accounts</span>
            <div style={{ background: "#e6f4ea", color: "#137333", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{stats.total_paid_submissions}</h3>
          <span style={{ fontSize: "0.75rem", color: "#137333", fontWeight: 600, display: "block", marginTop: "0.5rem" }}>
            {stats.total_submissions > 0 ? Math.round((stats.total_paid_submissions / stats.total_submissions) * 100) : 0}% success rate
          </span>
        </div>

        {/* Card 3: Pending Payments */}
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pending Payments</span>
            <div style={{ background: "#fffbeb", color: "#b45309", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{stats.total_pending_submissions}</h3>
          <span style={{ fontSize: "0.75rem", color: "#b45309", display: "block", marginTop: "0.5rem" }}>Awaiting verification</span>
        </div>

        {/* Card 4: Total Students */}
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Students</span>
            <div style={{ background: "rgba(30, 27, 117, 0.1)", color: "#1e1b4b", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            </div>
          </div>
          <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{stats.total_students}</h3>
          <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginTop: "0.5rem" }}>Unique user accounts</span>
        </div>

      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem" }}>
        
        {/* Recent Registrations Log */}
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Recent Registrations</h3>
            <Link href="/admin/registrations" style={{ fontSize: "0.85rem", color: "var(--color-accent-orange-hover)", fontWeight: 700, textDecoration: "none" }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {stats.recent_activity.map((act: any) => (
              <div key={act.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{act.student_name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{act.student_email}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", background: "rgba(255, 184, 0, 0.15)", color: "var(--color-accent-orange-hover)", padding: "0.2rem 0.5rem", borderRadius: "6px", fontWeight: 700, display: "inline-block" }}>
                    {act.form_name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                    {new Date(act.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>
            ))}
            {stats.recent_activity.length === 0 && (
              <p style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}>No recent registrations found.</p>
            )}
          </div>
        </div>

        {/* Tier Distribution Breakdown */}
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "1.5rem", margin: 0 }}>Tiers Distribution</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {stats.tier_distribution.map((td: any) => {
              const percentage = stats.total_submissions > 0 ? (td.count / stats.total_submissions) * 100 : 0;
              return (
                <div key={td.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>
                    <span>{td.name}</span>
                    <span style={{ color: "#64748b" }}>{td.count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${percentage}%`, height: "100%", background: "var(--color-accent-orange)", borderRadius: "4px" }}></div>
                  </div>
                </div>
              );
            })}
            {stats.tier_distribution.length === 0 && (
              <p style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}>No tiers found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
