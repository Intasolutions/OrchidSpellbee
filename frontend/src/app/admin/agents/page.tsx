"use client";

import { useEffect, useState } from "react";
import { getAgents, saveAgent, deleteAgent } from "../actions";

export default function AgentsManager() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    const data = await getAgents();
    if (Array.isArray(data)) {
      setAgents(data);
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingAgent(null);
    setFormData({ name: "", email: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (agent: any) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Name and Email are required.");
      return;
    }

    const res = await saveAgent(editingAgent?.id || null, formData);
    if (res.success) {
      alert(editingAgent ? "Agent updated successfully!" : "Agent created successfully!");
      setIsModalOpen(false);
      loadAgents();
    } else {
      alert("Error saving agent: " + res.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this agent? This will NOT delete their schools, but they will be unassigned from this agent.")) return;
    const res = await deleteAgent(id);
    if (res.success) {
      setAgents(agents.filter(a => a.id !== id));
      alert("Agent deleted successfully!");
    } else {
      alert("Error deleting agent: " + res.error);
    }
  };

  const filteredAgents = agents.filter((a: any) => {
    return (
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.phone && a.phone.includes(searchQuery))
    );
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Agents Manager</h1>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>
            Add, update, or remove agents who coordinate spelling programs with local schools.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#1e1b4b",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 6px -1px rgba(30,27,75,0.2)"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Agent
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "2rem", background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "400px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
            Search Agents
          </label>
          <input 
            type="text" 
            placeholder="Search by agent name, email or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {/* Agents Table */}
      <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "700px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "1rem" }}>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Agent Details</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Contact Info</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", textAlign: "center" }}>Schools Coordinated</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Date Added</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
                    Loading agents...
                  </td>
                </tr>
              ) : filteredAgents.map((agent: any) => (
                <tr key={agent.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: "1rem" }}>{agent.name}</div>
                  </td>
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <div style={{ fontSize: "0.9rem", color: "#1e293b", fontWeight: 500 }}>{agent.email}</div>
                    {agent.phone && (
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.1rem" }}>{agent.phone}</div>
                    )}
                  </td>
                  <td style={{ padding: "1.2rem 1rem", textAlign: "center" }}>
                    <span style={{ background: "rgba(30, 27, 75, 0.08)", color: "#1e1b4b", padding: "0.3rem 0.8rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700 }}>
                      {agent.schools_count} schools
                    </span>
                  </td>
                  <td style={{ padding: "1.2rem 1rem", color: "#64748b", fontSize: "0.85rem" }}>
                    {new Date(agent.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td style={{ padding: "1.2rem 1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button 
                        onClick={() => handleOpenEdit(agent)}
                        style={{ border: "none", background: "rgba(30, 27, 75, 0.1)", color: "#1e1b4b", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(agent.id)}
                        style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    No agents registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "450px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e1b4b", fontWeight: 800 }}>
                {editingAgent ? "Edit Agent Profile" : "Add New Agent"}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ border: "none", background: "transparent", color: "#64748b", fontSize: "1.1rem", cursor: "pointer" }}>
                ✕
              </button>
            </div>
            
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                  Agent Name *
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                  Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                  placeholder="e.g. rahul@example.com"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                  Phone Number
                </label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>

            <div style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                style={{ border: "1px solid #cbd5e1", background: "white", color: "#64748b", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ border: "none", background: "#1e1b4b", color: "white", padding: "0.5rem 1.25rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                {editingAgent ? "Save Changes" : "Create Agent"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
