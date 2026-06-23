"use client";

import { useEffect, useState } from "react";
import { getSubmissions, updateSubmissionPaymentStatus, deleteSubmission, getTierForms } from "../actions";

export default function RegistrationsManager() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tierForms, setTierForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    Promise.all([getSubmissions(), getTierForms()]).then(([subsData, formsData]) => {
      if (Array.isArray(subsData)) setSubmissions(subsData);
      if (Array.isArray(formsData)) setTierForms(formsData);
      setLoading(false);
    });
  }, []);

  const handleTogglePayment = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "PAID" ? "PENDING" : "PAID";
    const res = await updateSubmissionPaymentStatus(id, nextStatus);
    if (res.success) {
      setSubmissions(submissions.map(sub => sub.id === id ? { ...sub, payment_status: nextStatus } : sub));
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub({ ...selectedSub, payment_status: nextStatus });
      }
    } else {
      alert("Error updating payment: " + res.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this registration? This cannot be undone.")) return;
    const res = await deleteSubmission(id);
    if (res.success) {
      setSubmissions(submissions.filter(sub => sub.id !== id));
      setSelectedSub(null);
    } else {
      alert("Error deleting registration: " + res.error);
    }
  };

  // Filter logic
  const filteredSubmissions = submissions.filter((sub: any) => {
    const matchesSearch = 
      sub.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sub.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.student_code && sub.student_code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = selectedTier === "" || sub.form_name === selectedTier;
    const matchesStatus = selectedStatus === "" || sub.payment_status === selectedStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleExportExcel = () => {
    if (filteredSubmissions.length === 0) {
      alert("No registrations available to export!");
      return;
    }
    // Headers
    const headers = ["Registration ID", "Student Code", "Student Name", "Student Email", "Level / Stage", "Payment Status", "Date Registered", "Dynamic Fields Data"];
    
    // Rows mapping
    const rows = filteredSubmissions.map((sub: any) => {
      // Stringify custom fields dynamically
      const fieldsString = Object.entries(sub.data)
        .map(([key, val]) => `${key}: ${val}`)
        .join(" | ");

      return [
        sub.id,
        `"${(sub.student_code || "").replace(/"/g, '""')}"`,
        `"${sub.student_name.replace(/"/g, '""')}"`,
        `"${sub.student_email.replace(/"/g, '""')}"`,
        `"${sub.form_name.replace(/"/g, '""')}"`,
        sub.payment_status,
        new Date(sub.submitted_at).toLocaleDateString(),
        `"${fieldsString.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Orchid_Spellbee_Registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Registrations Manager</h1>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>View, filter, and export student registration details and payment states.</p>
        </div>
        <button 
          onClick={handleExportExcel}
          style={{ 
            background: "#16a34a", 
            color: "white", 
            border: "none", 
            padding: "0.75rem 1.5rem", 
            borderRadius: "8px", 
            fontWeight: 700, 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 10px rgba(22, 163, 74, 0.2)"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Export Excel / CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem", background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        
        {/* Search */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Search Student</label>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
          />
        </div>

        {/* Dynamic Level Filter */}
        <div style={{ minWidth: "180px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Filter by Level</label>
          <select 
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white", color: "#000" }}
          >
            <option value="">All Levels</option>
            {tierForms.map((tf) => (
              <option key={tf.id} value={tf.name}>{tf.name}</option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div style={{ minWidth: "150px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Payment Status</label>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white", color: "#000" }}
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

      </div>

      {/* Registrations List Table */}
      <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "1rem" }}>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Student details</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Spelling Level</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Payment State</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Date Registered</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
                    Loading registration entries...
                  </td>
                </tr>
              ) : filteredSubmissions.map((sub: any) => (
                <tr 
                  key={sub.id} 
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700, color: "#1e1b4b" }}>{sub.student_name}</div>
                      {sub.student_code && (
                        <span style={{ background: "rgba(255, 184, 0, 0.12)", color: "var(--color-accent-orange-hover)", fontSize: "0.65rem", padding: "0.15rem 0.4rem", borderRadius: "4px", fontWeight: 800, letterSpacing: "0.5px" }}>
                          {sub.student_code}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.15rem" }}>{sub.student_email}</div>
                  </td>

                  <td style={{ padding: "1.2rem 1rem" }}>
                    <span style={{ background: "rgba(30, 27, 117, 0.08)", color: "#1e1b4b", padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                      {sub.form_name}
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <span 
                      onClick={() => handleTogglePayment(sub.id, sub.payment_status)}
                      style={{ 
                        background: sub.payment_status === "PAID" ? "#e6f4ea" : "#fffbeb", 
                        color: sub.payment_status === "PAID" ? "#137333" : "#b45309", 
                        padding: "0.3rem 0.6rem", 
                        borderRadius: "6px", 
                        fontSize: "0.75rem", 
                        fontWeight: 800,
                        textTransform: "uppercase",
                        cursor: "pointer"
                      }}
                      title="Click to toggle status"
                    >
                      {sub.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1rem", color: "#64748b", fontSize: "0.85rem" }}>
                    {new Date(sub.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td style={{ padding: "1.2rem 1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button 
                        onClick={() => setSelectedSub(sub)}
                        style={{ border: "1px solid #e2e8f0", background: "white", padding: "0.4rem 0.8rem", borderRadius: "6px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", color: "#475569" }}
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleDelete(sub.id)}
                        style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.4rem 0.8rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    No matching registration entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedSub && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "550px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative", color: "#000" }}>
            <button 
              onClick={() => setSelectedSub(null)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}
            >
              &times;
            </button>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "0.5rem", margin: 0 }}>Registration details</h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Detailed profile fields submitted by student.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "350px", overflowY: "auto", paddingRight: "0.5rem" }}>
              
              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Student Name</span>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e1b4b", marginTop: "0.15rem" }}>{selectedSub.student_name}</div>
              </div>

              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Email Address</span>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e1b4b", marginTop: "0.15rem" }}>{selectedSub.student_email}</div>
              </div>

              {selectedSub.student_code && (
                <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Student Code</span>
                  <div style={{ display: "inline-block", background: "rgba(255, 184, 0, 0.12)", color: "var(--color-accent-orange-hover)", fontSize: "0.8rem", padding: "0.25rem 0.6rem", borderRadius: "6px", fontWeight: 800, marginTop: "0.25rem", letterSpacing: "0.5px" }}>
                    {selectedSub.student_code}
                  </div>
                </div>
              )}

              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Level / Stage Registered</span>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e1b4b", marginTop: "0.15rem" }}>{selectedSub.form_name}</div>
              </div>


              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Payment Status</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <span style={{ background: selectedSub.payment_status === "PAID" ? "#e6f4ea" : "#fffbeb", color: selectedSub.payment_status === "PAID" ? "#137333" : "#b45309", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 800 }}>
                    {selectedSub.payment_status}
                  </span>
                  <button 
                    onClick={() => handleTogglePayment(selectedSub.id, selectedSub.payment_status)}
                    style={{ border: "none", background: "none", color: "var(--color-accent-orange-hover)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Toggle payment
                  </button>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Custom Form Answers</span>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {Object.entries(selectedSub.data).map(([label, val]: any) => (
                    <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>{label}</span>
                      <span style={{ fontSize: "0.9rem", color: "#1e293b", fontWeight: 600 }}>{val || "-"}</span>
                    </div>
                  ))}
                  {Object.keys(selectedSub.data).length === 0 && (
                    <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontStyle: "italic" }}>No answers submitted.</span>
                  )}
                </div>
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", gap: "1rem" }}>
              <button 
                onClick={() => handleDelete(selectedSub.id)}
                style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
              >
                Delete record
              </button>
              <button 
                onClick={() => setSelectedSub(null)}
                style={{ background: "#1e1b4b", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
