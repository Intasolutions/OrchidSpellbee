"use client";

import { useEffect, useState } from "react";
import { getTierForms, saveTierForm, deleteTierForm } from "../actions";

export default function FormsManager() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingForm, setEditingForm] = useState<any>(null); // Level being created/edited

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    const data = await getTierForms();
    if (Array.isArray(data)) setForms(data);
    setLoading(false);
  };

  const handleCreateNew = () => {
    setEditingForm({
      id: null,
      name: "",
      description: "",
      entry_fee: 0.00,
      is_active: true,
      order: forms.length,
      fields: []
    });
  };

  const handleEdit = (form: any) => {
    // Clone form to avoid mutating original state directly before saving
    setEditingForm(JSON.parse(JSON.stringify(form)));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this level and all its dynamic registration fields? This will delete all submissions linked to this form.")) return;
    const res = await deleteTierForm(id);
    if (res.success) {
      setForms(forms.filter(f => f.id !== id));
      if (editingForm && editingForm.id === id) setEditingForm(null);
    } else {
      alert("Error deleting level: " + res.error);
    }
  };

  const handleAddField = () => {
    if (!editingForm) return;
    const newField = {
      label: "",
      field_type: "text",
      options: "",
      required: true,
      order: editingForm.fields.length
    };
    setEditingForm({
      ...editingForm,
      fields: [...editingForm.fields, newField]
    });
  };

  const handleFieldChange = (index: number, key: string, value: any) => {
    if (!editingForm) return;
    const updatedFields = editingForm.fields.map((f: any, idx: number) => 
      idx === index ? { ...f, [key]: value } : f
    );
    setEditingForm({
      ...editingForm,
      fields: updatedFields
    });
  };

  const handleRemoveField = (index: number) => {
    if (!editingForm) return;
    const updatedFields = editingForm.fields.filter((_: any, idx: number) => idx !== index)
      .map((f: any, idx: number) => ({ ...f, order: idx })); // Recalculate order
    setEditingForm({
      ...editingForm,
      fields: updatedFields
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm) return;

    // Validate fields
    if (editingForm.fields.some((f: any) => !f.label.trim())) {
      alert("All fields must have a label!");
      return;
    }

    const res = await saveTierForm(editingForm.id, editingForm);
    if (res.success) {
      setEditingForm(null);
      loadForms();
    } else {
      alert("Error saving form: " + res.error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Form Tiers Builder</h1>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>Configure spelling bee competition stages, dynamic entry fees, and custom input forms.</p>
        </div>
        {!editingForm && (
          <button 
            onClick={handleCreateNew}
            style={{ 
              background: "var(--color-accent-orange-hover)", 
              color: "white", 
              border: "none", 
              padding: "0.75rem 1.5rem", 
              borderRadius: "8px", 
              fontWeight: 700, 
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(230, 166, 0, 0.2)"
            }}
          >
            + Create Level
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: editingForm ? "1fr 1.5fr" : "1fr", gap: "2rem", alignItems: "start" }}>
        
        {/* Levels List */}
        <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "1.25rem", margin: 0 }}>Active Levels Progression</h3>
          
          {loading ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}>Loading levels...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {forms.map((form) => (
                <div 
                  key={form.id} 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "1rem", 
                    borderRadius: "12px", 
                    background: editingForm?.id === form.id ? "rgba(255, 184, 0, 0.05)" : "#f8fafc", 
                    border: editingForm?.id === form.id ? "1px solid var(--color-accent-orange)" : "1px solid #f1f5f9"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e1b4b" }}>{form.name}</span>
                      {!form.is_active && (
                        <span style={{ fontSize: "0.65rem", background: "#cbd5e1", color: "#475569", padding: "0.15rem 0.4rem", borderRadius: "4px", fontWeight: 700 }}>INACTIVE</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>Entry Fee: ₹{form.entry_fee} | Fields: {form.fields?.length || 0}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button 
                      onClick={() => handleEdit(form)}
                      style={{ border: "1px solid #cbd5e1", background: "white", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", color: "#334155" }}
                    >
                      Edit Builder
                    </button>
                    <button 
                      onClick={() => handleDelete(form.id)}
                      style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {forms.length === 0 && (
                <p style={{ color: "#64748b", textAlign: "center", padding: "2rem", fontStyle: "italic" }}>No levels configured yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Builder Editor */}
        {editingForm && (
          <form 
            onSubmit={handleSave}
            style={{ background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", color: "#000" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>
                {editingForm.id ? `Configure Level: ${editingForm.name}` : "Create Level Stage"}
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingForm(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Level Name */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Level Name</label>
                <input 
                  type="text" 
                  required
                  placeholder='e.g. "State Level"'
                  value={editingForm.name}
                  onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                  style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Description</label>
                <textarea 
                  placeholder="Optional details, qualifications info..."
                  value={editingForm.description || ""}
                  onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                  rows={2}
                  style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem", fontFamily: "inherit" }}
                />
              </div>

              {/* Fee & order & active */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Entry Fee (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    value={editingForm.entry_fee}
                    onChange={(e) => setEditingForm({ ...editingForm, entry_fee: parseFloat(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>Progression Order</label>
                  <input 
                    type="number" 
                    required
                    value={editingForm.order}
                    onChange={(e) => setEditingForm({ ...editingForm, order: parseInt(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
                  <input 
                    type="checkbox"
                    checked={editingForm.is_active}
                    onChange={(e) => setEditingForm({ ...editingForm, is_active: e.target.checked })}
                    style={{ width: "16px", height: "16px" }}
                  />
                  Active Level (Visible for new registrants)
                </label>
              </div>

              {/* Form Fields Section */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#1e1b4b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Dynamic Registration Fields</span>
                  <button 
                    type="button" 
                    onClick={handleAddField}
                    style={{ border: "1px dashed var(--color-accent-orange)", background: "rgba(255, 184, 0, 0.08)", color: "var(--color-accent-orange-hover)", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    + Add Input Field
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {editingForm.fields.map((field: any, index: number) => (
                    <div 
                      key={index} 
                      style={{ 
                        border: "1px solid #e2e8f0", 
                        borderRadius: "10px", 
                        padding: "1rem", 
                        background: "#f8fafc",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      {/* Close button */}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveField(index)}
                        style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#ef4444" }}
                        title="Remove Field"
                      >
                        &times;
                      </button>

                      {/* Field label */}
                      <div style={{ paddingRight: "1.5rem" }}>
                        <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Field Label</label>
                        <input 
                          type="text" 
                          placeholder='e.g. "School Name" or "District Name"'
                          value={field.label}
                          onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                          style={{ width: "100%", padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.85rem" }}
                        />
                      </div>

                      {/* Field type and required checkbox */}
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem", alignItems: "center" }}>
                        <div>
                          <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Input Type</label>
                          <select 
                            value={field.field_type}
                            onChange={(e) => handleFieldChange(index, "field_type", e.target.value)}
                            style={{ width: "100%", padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.85rem", background: "white", color: "#000" }}
                          >
                            <option value="text">Text Input</option>
                            <option value="email">Email Address</option>
                            <option value="number">Number</option>
                            <option value="select">Dropdown Choices</option>
                          </select>
                        </div>
                        
                        <div style={{ marginTop: "1rem" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}>
                            <input 
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
                              style={{ width: "14px", height: "14px" }}
                            />
                            Required Field
                          </label>
                        </div>
                      </div>

                      {/* Dropdown Options */}
                      {field.field_type === "select" && (
                        <div>
                          <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Dropdown Options (Comma separated)</label>
                          <input 
                            type="text" 
                            placeholder='e.g. "Thrissur, Ernakulam, Palakkad"'
                            value={field.options || ""}
                            onChange={(e) => handleFieldChange(index, "options", e.target.value)}
                            style={{ width: "100%", padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.85rem" }}
                          />
                        </div>
                      )}

                    </div>
                  ))}
                  {editingForm.fields.length === 0 && (
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", fontStyle: "italic", textAlign: "center", padding: "1rem", border: "1px dashed #e2e8f0", borderRadius: "8px", margin: 0 }}>No custom fields added yet. Default registers will only collect student name and email.</p>
                  )}
                </div>
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem" }}>
              <button 
                type="button" 
                onClick={() => setEditingForm(null)}
                style={{ border: "1px solid #cbd5e1", background: "white", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", color: "#334155" }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ background: "var(--color-accent-orange-hover)", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
              >
                Save Template
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
