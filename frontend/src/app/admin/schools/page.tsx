"use client";

import { useEffect, useState } from "react";
import { getSchools, getAgents, saveSchool, deleteSchool } from "../actions";
import { useRouter } from "next/navigation";

export default function SchoolsPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAgent, setFilterAgent] = useState("All Agents");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", agent: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [schoolsData, agentsData] = await Promise.all([getSchools(), getAgents()]);
    if (Array.isArray(schoolsData)) setSchools(schoolsData);
    if (Array.isArray(agentsData)) setAgents(agentsData);
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingSchool(null);
    setFormData({ name: "", agent: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (school: any) => {
    setEditingSchool(school);
    setFormData({ name: school.name, agent: school.agent ? school.agent.toString() : "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    const payload = { name: formData.name.trim(), agent: formData.agent ? parseInt(formData.agent) : null };
    const res = await saveSchool(editingSchool?.id || null, payload);
    setSaving(false);
    if (res.success) {
      setIsModalOpen(false);
      loadData();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async (school: any) => {
    if (!confirm(`Delete "${school.name}"? Students in this school will remain but school will be unlinked.`)) return;
    const res = await deleteSchool(school.id);
    if (res.success) {
      setSchools(prev => prev.filter(s => s.id !== school.id));
    } else {
      alert("Error: " + res.error);
    }
  };

  const filtered = schools.filter((s: any) => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAgent = filterAgent === "All Agents" ||
      (filterAgent === "Unassigned" && !s.agent_name) ||
      (s.agent_name && s.agent_name === filterAgent);
    return matchSearch && matchAgent;
  });

  const totalStudents = schools.reduce((sum: number, s: any) => sum + (s.students_count || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Schools</h1>
          <p style={{ color: "#64748b", margin: "0.3rem 0 0 0", fontSize: "0.95rem" }}>
            Schools are automatically added when students register. You can also add them manually and assign an agent.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "#1e1b4b", color: "white", border: "none",
            padding: "0.75rem 1.5rem", borderRadius: "10px",
            fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(30,27,75,0.2)", flexShrink: 0
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add School
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Schools", value: schools.length, color: "#1e1b4b", bg: "rgba(30,27,75,0.06)" },
          { label: "Total Students", value: totalStudents, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
          { label: "With Agent Assigned", value: schools.filter(s => s.agent_name).length, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: "12px", padding: "1.25rem 1.5rem", border: `1px solid ${stat.bg}` }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: stat.color }}>
              {loading ? "—" : stat.value}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, marginTop: "0.2rem" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem", background: "white", padding: "1rem 1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <input
            type="text"
            placeholder="🔍  Search schools by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ minWidth: "200px" }}>
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white", color: "#1e1b4b" }}
          >
            <option value="All Agents">All Agents</option>
            <option value="Unassigned">No Agent Assigned</option>
            {agents.map((a: any) => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
        </div>
      </div>

      {/* Schools Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontSize: "1rem" }}>Loading schools...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏫</div>
          <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: "1.1rem" }}>No schools found</div>
          <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Schools will appear here automatically once students register and enter their school name.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {filtered.map((school: any) => (
            <div
              key={school.id}
              style={{
                background: "white", borderRadius: "14px", padding: "1.5rem",
                border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                display: "flex", flexDirection: "column", gap: "1rem",
                transition: "box-shadow 0.2s"
              }}
            >
              {/* School name + agent badge */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.3 }}>
                    {school.name}
                  </h3>
                  {school.agent_name ? (
                    <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "0.25rem 0.65rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {school.agent_name}
                    </span>
                  ) : (
                    <span style={{ background: "#f1f5f9", color: "#94a3b8", padding: "0.25rem 0.65rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                      No Agent
                    </span>
                  )}
                </div>
                <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#64748b", fontSize: "0.85rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <strong style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1rem" }}>{school.students_count ?? 0}</strong>
                  <span>{school.students_count === 1 ? "student" : "students"} registered</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                {/* Find Students */}
                <button
                  onClick={() => router.push(`/admin/students?school=${encodeURIComponent(school.name)}`)}
                  style={{
                    flex: 1, padding: "0.5rem 0.75rem", background: "rgba(30,27,75,0.07)",
                    color: "#1e1b4b", border: "none", borderRadius: "8px",
                    fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: "0.35rem"
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Find Students
                </button>
                {/* Edit */}
                <button
                  onClick={() => handleOpenEdit(school)}
                  style={{ padding: "0.5rem 0.75rem", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Edit
                </button>
                {/* Delete */}
                <button
                  onClick={() => handleDelete(school)}
                  style={{ padding: "0.5rem 0.75rem", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100, padding: "1rem" }}>
          <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "420px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", color: "#1e1b4b", fontWeight: 800 }}>
                {editingSchool ? "Edit School" : "Add School"}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ border: "none", background: "transparent", color: "#94a3b8", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.4rem" }}>School Name *</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. St. Mary's Higher Secondary School"
                  style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.4rem" }}>Assign Agent (Optional)</label>
                <select
                  value={formData.agent}
                  onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                  style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white", color: "#1e1b4b" }}
                >
                  <option value="">No Agent</option>
                  {agents.map((a: any) => <option key={a.id} value={a.id.toString()}>{a.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ border: "1px solid #e2e8f0", background: "white", color: "#64748b", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} style={{ border: "none", background: "#1e1b4b", color: "white", padding: "0.5rem 1.25rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : editingSchool ? "Save Changes" : "Add School"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
