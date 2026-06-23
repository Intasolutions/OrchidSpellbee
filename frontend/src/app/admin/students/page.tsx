"use client";

import { useEffect, useState } from "react";
import { getStudents, getTierForms, promoteStudent, deleteStudent } from "../actions";

export default function StudentsManager() {
  const [students, setStudents] = useState<any[]>([]);
  const [tierForms, setTierForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [studentsData, formsData] = await Promise.all([getStudents(), getTierForms()]);
    if (Array.isArray(studentsData)) setStudents(studentsData);
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student profile? This will delete the student and their registration history.")) return;
    const res = await deleteStudent(id);
    if (res.success) {
      setStudents(students.filter(s => s.id !== id));
    } else {
      alert("Error deleting student: " + res.error);
    }
  };

  const filteredStudents = students.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Students Database</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>Monitor student accounts and promote them through competition tiers (School, District, State, National).</p>
      </div>

      {/* Filters Bar */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem", background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Search Students</label>
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
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Active Level / Stage</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Promote / Advance Level</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Date Joined</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
                    Loading student database...
                  </td>
                </tr>
              ) : filteredStudents.map((student: any) => (
                <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <div style={{ fontWeight: 700, color: "#1e1b4b" }}>{student.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{student.email}</div>
                  </td>
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
                      onClick={() => handleDelete(student.id)}
                      style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.4rem 0.8rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      Delete Profile
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    No students registered in the database.
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
