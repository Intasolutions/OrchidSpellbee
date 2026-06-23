"use client";

import { useEffect, useState } from "react";
import { getStudents, getTierForms, promoteStudent, deleteStudent, restoreStudent } from "../actions";

export default function StudentsManager() {
  const [activeTab, setActiveTab] = useState<"active" | "trash">("active");
  const [students, setStudents] = useState<any[]>([]);
  const [trashedStudents, setTrashedStudents] = useState<any[]>([]);
  const [tierForms, setTierForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [studentsData, trashData, formsData] = await Promise.all([
      getStudents(false),
      getStudents(true),
      getTierForms()
    ]);
    if (Array.isArray(studentsData)) setStudents(studentsData);
    if (Array.isArray(trashData)) setTrashedStudents(trashData);
    if (Array.isArray(formsData)) setTierForms(formsData);
    setLoading(false);
  };

  const handlePromote = async (studentId: number, tierId: string) => {
    if (!tierId) return; // Ignore select level placeholder
    const res = await promoteStudent(studentId, parseInt(tierId));
    if (res.success) {
      const updatedTier = tierForms.find(tf => tf.id === parseInt(tierId));
      setStudents(students.map(s => s.id === studentId ? { ...s, current_tier: parseInt(tierId), current_tier_name: updatedTier?.name || "None" } : s));
    } else {
      alert("Error promoting student: " + res.error);
    }
  };

  const handleDeleteActive = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student profile? This will move it to the Trash.")) return;
    const res = await deleteStudent(id);
    if (res.success) {
      const deletedStudent = students.find(s => s.id === id);
      setStudents(students.filter(s => s.id !== id));
      if (deletedStudent) {
        setTrashedStudents([
          { ...deletedStudent, is_deleted: true, deleted_at: new Date().toISOString() },
          ...trashedStudents
        ]);
      }
    } else {
      alert("Error deleting student: " + res.error);
    }
  };

  const handleRestore = async (id: number) => {
    const res = await restoreStudent(id);
    if (res.success) {
      const restoredStudent = trashedStudents.find(s => s.id === id);
      setTrashedStudents(trashedStudents.filter(s => s.id !== id));
      if (restoredStudent) {
        setStudents([
          { ...restoredStudent, is_deleted: false, deleted_at: null },
          ...students
        ]);
      }
    } else {
      alert("Error restoring student: " + res.error);
    }
  };

  const handleDeletePermanent = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this student profile? This will delete all their registration history and CANNOT be undone.")) return;
    const res = await deleteStudent(id);
    if (res.success) {
      setTrashedStudents(trashedStudents.filter(s => s.id !== id));
    } else {
      alert("Error permanently deleting student: " + res.error);
    }
  };

  const filteredStudents = students.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrashed = trashedStudents.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedList = activeTab === "active" ? filteredStudents : filteredTrashed;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Students Database</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>
          Monitor student accounts, promote them through competition tiers, and manage deleted profiles.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("active")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            background: activeTab === "active" ? "rgba(30, 27, 75, 0.08)" : "transparent",
            color: activeTab === "active" ? "#1e1b4b" : "#64748b",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Active Database
          <span style={{
            background: "#1e1b4b",
            color: "white",
            fontSize: "0.75rem",
            padding: "0.1rem 0.4rem",
            borderRadius: "20px",
            marginLeft: "0.25rem",
            fontWeight: 600
          }}>
            {students.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("trash")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            background: activeTab === "trash" ? "rgba(239, 68, 68, 0.08)" : "transparent",
            color: activeTab === "trash" ? "#ef4444" : "#64748b",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Trash / Deleted Profiles
          {trashedStudents.length > 0 && (
            <span style={{
              background: "#ef4444",
              color: "white",
              fontSize: "0.75rem",
              padding: "0.1rem 0.4rem",
              borderRadius: "20px",
              marginLeft: "0.25rem",
              fontWeight: 600
            }}>
              {trashedStudents.length}
            </span>
          )}
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem", background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
            Search {activeTab === "active" ? "Students" : "Trashed Profiles"}
          </label>
          <input 
            type="text" 
            placeholder="Search by student name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {/* Students List Table */}
      <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "1rem" }}>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Student Name & Email</th>
                {activeTab === "active" ? (
                  <>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Active Level / Stage</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Promote / Advance Level</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Date Joined</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Last Active Level</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Date Deleted</th>
                  </>
                )}
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={activeTab === "active" ? 5 : 4} style={{ padding: "3rem", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
                    Loading database...
                  </td>
                </tr>
              ) : displayedList.map((student: any) => (
                <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <div style={{ fontWeight: 700, color: "#1e1b4b" }}>{student.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{student.email}</div>
                  </td>
                  
                  {activeTab === "active" ? (
                    <>
                      <td style={{ padding: "1.2rem 1rem" }}>
                        <span style={{ background: "rgba(30, 27, 117, 0.08)", color: "#1e1b4b", padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                          {student.current_tier_name || "None"}
                        </span>
                      </td>
                      <td style={{ padding: "1.2rem 1rem" }}>
                        <select
                          value={student.current_tier || ""}
                          onChange={(e) => handlePromote(student.id, e.target.value)}
                          style={{ padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.85rem", background: "white", color: "#000", width: "100%", maxWidth: "200px" }}
                        >
                          <option value="">Select Level...</option>
                          {tierForms.map((tf) => (
                            <option key={tf.id} value={tf.id}>{tf.name}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", color: "#64748b", fontSize: "0.85rem" }}>
                        {new Date(student.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td style={{ padding: "1.2rem 1rem", textAlign: "right" }}>
                        <button 
                          onClick={() => handleDeleteActive(student.id)}
                          style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                        >
                          Delete Profile
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "1.2rem 1rem" }}>
                        <span style={{ background: "rgba(100, 116, 139, 0.08)", color: "#64748b", padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                          {student.current_tier_name || "None"}
                        </span>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", color: "#64748b", fontSize: "0.85rem" }}>
                        {student.deleted_at 
                          ? new Date(student.deleted_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "Unknown"}
                      </td>
                      <td style={{ padding: "1.2rem 1rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <button 
                            onClick={() => handleRestore(student.id)}
                            style={{ border: "none", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                          >
                            Restore Profile
                          </button>
                          <button 
                            onClick={() => handleDeletePermanent(student.id)}
                            style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                          >
                            Delete Permanently
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {!loading && displayedList.length === 0 && (
                <tr>
                  <td colSpan={activeTab === "active" ? 5 : 4} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    {activeTab === "active" 
                      ? "No active students registered in the database." 
                      : "Trash is empty."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
