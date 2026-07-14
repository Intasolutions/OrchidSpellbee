"use client";

import { useEffect, useState } from "react";
import { getSubmissions, updateSubmissionPaymentStatus, deleteSubmission, getTierForms, updateSubmissionMarks, adminAddRegistration, adminBulkAddRegistrations } from "../actions";

export default function RegistrationsManager() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tierForms, setTierForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedResult, setSelectedResult] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addFormId, setAddFormId] = useState("");
  const [addPaymentStatus, setAddPaymentStatus] = useState("PAID");
  const [addCustomData, setAddCustomData] = useState<any>({});
  const [addLoading, setAddLoading] = useState(false);

  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkFormId, setBulkFormId] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

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
    let matchesStatus = true;
    if (selectedStatus === "NO_PAYMENT") {
      matchesStatus = sub.entry_fee == 0;
    } else if (selectedStatus !== "") {
      matchesStatus = sub.entry_fee > 0 && sub.payment_status === selectedStatus;
    }
    let matchesResult = true;
    if (selectedResult === "PASSED") matchesResult = sub.is_passed === true;
    if (selectedResult === "FAILED") matchesResult = sub.is_passed === false;
    if (selectedResult === "PENDING") matchesResult = sub.is_passed === null;

    return matchesSearch && matchesTier && matchesStatus && matchesResult;
  });

  const handleExportExcel = () => {
    if (filteredSubmissions.length === 0) {
      alert("No registrations available to export!");
      return;
    }
    // Headers
    const headers = ["Registration ID", "Student Code", "Student Name", "Student Email", "Level / Stage", "Payment Status", "Marks", "Result", "Date Registered", "Dynamic Fields Data"];
    
    // Rows mapping
    const rows = filteredSubmissions.map((sub: any) => {
      // Stringify custom fields dynamically
      const fieldsString = Object.entries(sub.labeled_data || sub.data)
        .map(([key, val]) => `${key}: ${val}`)
        .join(" | ");

      return [
        sub.id,
        `"${(sub.student_code || "").replace(/"/g, '""')}"`,
        `"${sub.student_name.replace(/"/g, '""')}"`,
        `"${sub.student_email.replace(/"/g, '""')}"`,
        `"${sub.form_name.replace(/"/g, '""')}"`,
        sub.payment_status,
        sub.marks !== null ? sub.marks : "N/A",
        sub.is_passed === true ? "Passed" : sub.is_passed === false ? "Failed" : "Pending",
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

  const handleManualAdd = async () => {
    if (!addName || !addEmail || !addFormId) return alert("Please fill Name, Email, and Form ID");
    setAddLoading(true);
    const res = await adminAddRegistration({
      name: addName,
      email: addEmail,
      form_id: parseInt(addFormId),
      payment_status: addPaymentStatus,
      data: addCustomData
    });
    setAddLoading(false);
    if (res.success) {
      alert("Student registered successfully!");
      setShowAddModal(false);
      window.location.reload();
    } else {
      alert("Error adding student: " + res.error);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return alert("Please select a CSV file");
    setBulkLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split("\n").filter(r => r.trim());
        const headers = rows[0].split(",").map(h => h.trim().toLowerCase());
        
        const registrations = [];
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(",").map(v => v.trim());
          if (values.length >= 3) {
            const formId = parseInt(values[headers.indexOf("form_id")]);
            const tf = tierForms.find(t => t.id === formId);
            const customData: any = {};
            
            if (tf) {
              headers.forEach((h, idx) => {
                if (["name", "email", "form_id", "payment_status"].includes(h)) return;
                const field = tf.fields.find((f: any) => f.label.toLowerCase() === h);
                if (field) {
                  customData[field.id] = values[idx];
                }
              });
            }

            registrations.push({
              name: values[headers.indexOf("name")],
              email: values[headers.indexOf("email")],
              form_id: formId,
              payment_status: headers.includes("payment_status") ? (values[headers.indexOf("payment_status")] || "PAID") : "PAID",
              data: customData
            });
          }
        }
        
        const res = await adminBulkAddRegistrations(registrations);
        if (res.success) {
          alert(res.data.message || "Bulk upload successful!");
          setShowBulkModal(false);
          window.location.reload();
        } else {
          alert("Error in bulk upload: " + res.error);
        }
      } catch (err) {
        alert("Error parsing CSV. Please check the format.");
      }
      setBulkLoading(false);
    };
    reader.readAsText(bulkFile);
  };

  const downloadTemplate = () => {
    let headers = ["name", "email", "form_id", "payment_status"];
    let dummyData1: string[] = [];
    let dummyData2: string[] = [];
    
    if (bulkFormId) {
      const selectedTier = tierForms.find(tf => tf.id.toString() === bulkFormId);
      if (selectedTier && selectedTier.fields) {
        selectedTier.fields.forEach((f: any) => {
          headers.push(f.label);
          dummyData1.push(`Sample ${f.label}`);
          dummyData2.push(`Sample ${f.label}`);
        });
      }
    }

    const row1 = `John Doe,john@example.com,${bulkFormId || "1"},PAID${dummyData1.length ? "," + dummyData1.join(",") : ""}`;
    const row2 = `Jane Smith,jane@example.com,${bulkFormId || "1"},PENDING${dummyData2.length ? "," + dummyData2.join(",") : ""}`;

    const csvContent = headers.join(",") + "\n" + row1 + "\n" + row2;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bulk_upload_template${bulkFormId ? "_level_" + bulkFormId : ""}.csv`);
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
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ 
              background: "#3b82f6", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
            }}
          >
            Add Student
          </button>
          <button 
            onClick={() => setShowBulkModal(true)}
            style={{ 
              background: "#8b5cf6", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
            }}
          >
            Bulk Upload
          </button>
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
            <option value="NO_PAYMENT">No Payment</option>
          </select>
        </div>

        {/* Result Status Filter */}
        <div style={{ minWidth: "150px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Exam Result</label>
          <select 
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white", color: "#000" }}
          >
            <option value="">All Results</option>
            <option value="PASSED">Passed</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending Grading</option>
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
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Marks & Result</th>
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
                        background: (sub.payment_status === "PAID" || sub.entry_fee == 0) ? "#e6f4ea" : "#fffbeb", 
                        color: (sub.payment_status === "PAID" || sub.entry_fee == 0) ? "#137333" : "#b45309", 
                        padding: "0.3rem 0.6rem", 
                        borderRadius: "6px", 
                        fontSize: "0.75rem", 
                        fontWeight: 800,
                        textTransform: "uppercase",
                        cursor: "pointer"
                      }}
                      title="Click to toggle status"
                    >
                      {sub.entry_fee == 0 ? "NO PAYMENT" : (sub.payment_status === "PAID" ? `PAID ₹${sub.entry_fee}` : `PENDING ₹${sub.entry_fee}`)}
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <div style={{ fontWeight: 600 }}>{sub.marks !== null ? sub.marks : "-"}</div>
                    <span style={{ 
                      fontSize: "0.7rem", 
                      fontWeight: 700, 
                      color: sub.is_passed === true ? "#16a34a" : sub.is_passed === false ? "#dc2626" : "#94a3b8" 
                    }}>
                      {sub.is_passed === true ? "PASSED" : sub.is_passed === false ? "FAILED" : "PENDING"}
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

              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Exam Grading</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <input 
                    type="number" 
                    placeholder="Enter marks"
                    defaultValue={selectedSub.marks !== null ? selectedSub.marks : ""}
                    onBlur={async (e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const res = await updateSubmissionMarks(selectedSub.id, parseFloat(val));
                      if (res.success) {
                        // update local state
                        setSubmissions(submissions.map(s => s.id === selectedSub.id ? { ...s, marks: parseFloat(val), is_passed: res.data.is_passed } : s));
                        setSelectedSub({ ...selectedSub, marks: parseFloat(val), is_passed: res.data.is_passed });
                        alert("Marks updated successfully!");
                      } else {
                        alert("Error: " + res.error);
                      }
                    }}
                    style={{ padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", width: "120px" }}
                  />
                  <span style={{ 
                      fontSize: "0.8rem", 
                      fontWeight: 700, 
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      background: selectedSub.is_passed === true ? "#dcfce7" : selectedSub.is_passed === false ? "#fee2e2" : "#f1f5f9",
                      color: selectedSub.is_passed === true ? "#16a34a" : selectedSub.is_passed === false ? "#dc2626" : "#64748b" 
                    }}>
                      {selectedSub.is_passed === true ? "PASSED" : selectedSub.is_passed === false ? "FAILED" : "PENDING"}
                  </span>
                </div>
              </div>

              {Object.entries(selectedSub.labeled_data || selectedSub.data).map(([label, val]: any) => (
                <div key={label} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{label}</span>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e1b4b", marginTop: "0.15rem" }}>{val || "-"}</div>
                </div>
              ))}

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

      {/* Manual Add Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative", color: "#000" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "1.5rem", margin: 0 }}>Manual Add Student</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>Name</label>
                <input type="text" value={addName} onChange={e => setAddName(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>Email (Username)</label>
                <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>Level</label>
                <select value={addFormId} onChange={e => { setAddFormId(e.target.value); setAddCustomData({}); }} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white" }}>
                  <option value="">Select Level...</option>
                  {tierForms.map(tf => <option key={tf.id} value={tf.id}>{tf.name}</option>)}
                </select>
              </div>

              {/* Dynamic Custom Fields Rendering */}
              {addFormId && (() => {
                const selectedTier = tierForms.find(tf => tf.id.toString() === addFormId);
                if (!selectedTier || !selectedTier.fields || selectedTier.fields.length === 0) return null;
                return (
                  <>
                    {selectedTier.fields.map((f: any) => (
                      <div key={f.id}>
                        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>{f.label} {f.required && "*"}</label>
                        <input 
                          type="text" 
                          value={addCustomData[f.id] || ""} 
                          onChange={e => setAddCustomData({ ...addCustomData, [f.id]: e.target.value })} 
                          style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem" }} 
                          placeholder={`Enter ${f.label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </>
                );
              })()}

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>Payment Status</label>
                <select value={addPaymentStatus} onChange={e => setAddPaymentStatus(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white" }}>
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="NO_PAYMENT">NO PAYMENT</option>
                </select>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>Note: Default password is <b>Orchid@123</b></p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", gap: "1rem" }}>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "1px solid #cbd5e1", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer", color: "#475569" }}>Cancel</button>
              <button onClick={handleManualAdd} disabled={addLoading} style={{ background: "#3b82f6", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, cursor: addLoading ? "not-allowed" : "pointer" }}>{addLoading ? "Saving..." : "Add Student"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative", color: "#000" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "1.5rem", margin: 0 }}>Bulk Upload Registrations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.9rem", color: "#475569", margin: 0 }}>
                <b>Step 1:</b> Select the Level you want to upload students for. This will generate a CSV template with the correct custom fields (School, Class, etc.) for that Level.
              </p>
              
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.4rem" }}>Select Level for Template</label>
                <select value={bulkFormId} onChange={e => setBulkFormId(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white" }}>
                  <option value="">Select Level...</option>
                  {tierForms.map(tf => <option key={tf.id} value={tf.id}>{tf.name}</option>)}
                </select>
              </div>

              <button onClick={downloadTemplate} disabled={!bulkFormId} style={{ background: bulkFormId ? "#3b82f6" : "#cbd5e1", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: bulkFormId ? "pointer" : "not-allowed", fontWeight: 600, alignSelf: "flex-start" }}>
                Download CSV Template
              </button>

              <hr style={{ width: "100%", border: "none", borderTop: "1px solid #e2e8f0", margin: "0.5rem 0" }} />

              <p style={{ fontSize: "0.9rem", color: "#475569", margin: 0 }}>
                <b>Step 2:</b> Fill out the downloaded CSV and upload it here.
              </p>

              <div>
                <input type="file" accept=".csv" onChange={(e) => setBulkFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", gap: "1rem" }}>
              <button onClick={() => setShowBulkModal(false)} style={{ background: "none", border: "1px solid #cbd5e1", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer", color: "#475569" }}>Cancel</button>
              <button onClick={handleBulkUpload} disabled={bulkLoading || !bulkFile} style={{ background: "#8b5cf6", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, cursor: (bulkLoading || !bulkFile) ? "not-allowed" : "pointer" }}>{bulkLoading ? "Uploading..." : "Upload CSV"}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
