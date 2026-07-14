"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getStudents, getTierForms, promoteStudent, deleteStudent, restoreStudent, getStudentSubmissions, updateSubmissionMarks, getAgents } from "../actions";

function StudentsManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const schoolFromUrl = searchParams.get("school") || "";

  const [activeTab, setActiveTab] = useState<"active" | "trash">("active");
  const [students, setStudents] = useState<any[]>([]);
  const [trashedStudents, setTrashedStudents] = useState<any[]>([]);
  const [tierForms, setTierForms] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(schoolFromUrl);
  const [filterLevel, setFilterLevel] = useState("All Levels");
  const [filterAgent, setFilterAgent] = useState("All Agents");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Profile Modal State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentSubmissions, setStudentSubmissions] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [markInputs, setMarkInputs] = useState<{[key: number]: string}>({});

  useEffect(() => {
    loadData();
  }, []);

  // Update search when URL param changes
  useEffect(() => {
    if (schoolFromUrl) setSearchQuery(schoolFromUrl);
  }, [schoolFromUrl]);

  const loadData = async () => {
    setLoading(true);
    const [studentsData, trashData, formsData, agentsData] = await Promise.all([
      getStudents(false),
      getStudents(true),
      getTierForms(),
      getAgents()
    ]);
    if (Array.isArray(studentsData)) setStudents(studentsData);
    if (Array.isArray(trashData)) setTrashedStudents(trashData);
    if (Array.isArray(formsData)) setTierForms(formsData);
    if (Array.isArray(agentsData)) setAgents(agentsData);
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

  const openProfile = async (student: any) => {
    setSelectedStudent(student);
    setLoadingProfile(true);
    const data = await getStudentSubmissions(student.id);
    setStudentSubmissions(data || []);
    
    // Initialize marks input
    const initialMarks: {[key: number]: string} = {};
    data?.forEach((sub: any) => {
      if (sub.marks !== null) initialMarks[sub.id] = sub.marks.toString();
    });
    setMarkInputs(initialMarks);
    
    setLoadingProfile(false);
  };

  const handleUpdateMarks = async (submissionId: number) => {
    const marksValue = markInputs[submissionId];
    if (marksValue === undefined || marksValue === "") {
      alert("Please enter a valid mark.");
      return;
    }
    
    const res = await updateSubmissionMarks(submissionId, parseFloat(marksValue));
    if (res.success) {
      setStudentSubmissions(studentSubmissions.map(sub => 
        sub.id === submissionId 
          ? { ...sub, marks: parseFloat(marksValue), is_passed: res.data.is_passed } 
          : sub
      ));
      alert("Marks updated successfully!");
    } else {
      alert("Failed to update marks: " + res.error);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterLevel, filterAgent, activeTab]);

  const exportData = () => {
    const dataToExport = activeTab === "active" ? filteredStudents : filteredTrashed;
    if (dataToExport.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Student Code", "Name", "Email", "School Name", "Assigned Agent", "Current Level", "Date Joined"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((s: any) => [
        `"${s.student_code || ''}"`,
        `"${s.name}"`,
        `"${s.email}"`,
        `"${s.school_name || ''}"`,
        `"${s.agent_name || ''}"`,
        `"${s.current_tier_name || 'None'}"`,
        `"${new Date(s.created_at).toLocaleDateString()}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyFilters = (studentsList: any[]) => {
    return studentsList.filter((s: any) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (s.student_code && s.student_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (s.school_name && s.school_name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLevel = filterLevel === "All Levels" || s.current_tier_name === filterLevel;
      const matchesAgent = filterAgent === "All Agents" ||
                           (filterAgent === "Unassigned" && !s.agent_name) ||
                           (s.agent_name && s.agent_name === filterAgent);

      return matchesSearch && matchesLevel && matchesAgent;
    });
  };

  const filteredStudents = applyFilters(students);
  const filteredTrashed = applyFilters(trashedStudents);

  const displayedList = activeTab === "active" ? filteredStudents : filteredTrashed;
  const totalItems = displayedList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedList = displayedList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Students Database</h1>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.95rem" }}>
          Monitor student accounts, promote them through competition tiers, and manage deleted profiles.
        </p>
      </div>

      {/* School Filter Banner */}
      {schoolFromUrl && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(30,27,75,0.06)", border: "1px solid rgba(30,27,75,0.15)", borderRadius: "10px", padding: "0.75rem 1.25rem", marginBottom: "1.5rem" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span style={{ fontWeight: 700, color: "#1e1b4b", fontSize: "0.9rem" }}>
            Filtering by school: <span style={{ color: "#4338ca" }}>{schoolFromUrl}</span>
          </span>
          <span style={{ color: "#64748b", fontSize: "0.85rem" }}>— {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found</span>
          <button
            onClick={() => {
              setSearchQuery("");
              router.replace("/admin/students");
            }}
            style={{ marginLeft: "auto", background: "white", color: "#ef4444", padding: "0.3rem 0.75rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", border: "1px solid #fca5a5" }}
          >
            ✕ Clear Filter
          </button>
        </div>
      )}

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
            placeholder="Search by student name, email, code or school..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
          />
        </div>
        
        <div style={{ minWidth: "180px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
            Filter by Level
          </label>
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white", color: "#000" }}
          >
            <option value="All Levels">All Levels</option>
            {tierForms.map((tf) => (
              <option key={tf.id} value={tf.name}>{tf.name}</option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: "180px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
            Filter by Agent
          </label>
          <select 
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", background: "white", color: "#000" }}
          >
            <option value="All Agents">All Agents</option>
            <option value="Unassigned">Unassigned (No Agent)</option>
            {agents.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button 
            onClick={exportData}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#10b981", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", height: "42px", transition: "background 0.2s" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="M21 11.5V14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5"></path>
              <path d="M12 11v6"></path>
              <path d="M9 14l3 3 3-3"></path>
            </svg>
            Export Excel / CSV
          </button>
        </div>
      </div>

      {/* Students List Table */}
      <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "1rem" }}>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Student Name & Email</th>
                {activeTab === "active" ? (
                  <>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Active Level</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>School Name</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Assigned Agent</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Promote / Advance</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Date Joined</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Last Active Level</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>School Name</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Assigned Agent</th>
                    <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>Date Deleted</th>
                  </>
                )}
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={activeTab === "active" ? 7 : 6} style={{ padding: "3rem", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
                    Loading database...
                  </td>
                </tr>
              ) : paginatedList.map((student: any) => (
                <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1.2rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700, color: "#1e1b4b" }}>{student.name}</div>
                      {student.student_code && (
                        <span style={{ background: "rgba(255, 184, 0, 0.12)", color: "var(--color-accent-orange-hover)", fontSize: "0.65rem", padding: "0.15rem 0.4rem", borderRadius: "4px", fontWeight: 800, letterSpacing: "0.5px" }}>
                          {student.student_code}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.15rem" }}>{student.email}</div>
                  </td>

                  {activeTab === "active" ? (
                    <>
                      <td style={{ padding: "1.2rem 1rem" }}>
                        <span style={{ background: "rgba(30, 27, 117, 0.08)", color: "#1e1b4b", padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                          {student.current_tier_name || "None"}
                        </span>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", fontSize: "0.85rem", color: "#1e293b", fontWeight: 500 }}>
                        {student.school_name || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>None</span>}
                      </td>
                      <td style={{ padding: "1.2rem 1rem", fontSize: "0.85rem" }}>
                        {student.agent_name ? (
                          <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.3rem 0.6rem", borderRadius: "6px", fontWeight: 700 }}>
                            {student.agent_name}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Unassigned</span>
                        )}
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
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <button 
                            onClick={() => openProfile(student)}
                            style={{ border: "none", background: "rgba(30, 27, 75, 0.1)", color: "#1e1b4b", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                          >
                            View Profile
                          </button>
                          <button 
                            onClick={() => handleDeleteActive(student.id)}
                            style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                          >
                            Delete Profile
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: "1.2rem 1rem" }}>
                        <span style={{ background: "rgba(100, 116, 139, 0.08)", color: "#64748b", padding: "0.3rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                          {student.current_tier_name || "None"}
                        </span>
                      </td>
                      <td style={{ padding: "1.2rem 1rem", fontSize: "0.85rem", color: "#1e293b", fontWeight: 500 }}>
                        {student.school_name || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>None</span>}
                      </td>
                      <td style={{ padding: "1.2rem 1rem", fontSize: "0.85rem" }}>
                        {student.agent_name ? (
                          <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.3rem 0.6rem", borderRadius: "6px", fontWeight: 700 }}>
                            {student.agent_name}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Unassigned</span>
                        )}
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
              {!loading && paginatedList.length === 0 && (
                <tr>
                  <td colSpan={activeTab === "active" ? 7 : 6} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", padding: "0.75rem 1rem", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>
              Showing <span style={{ fontWeight: 600, color: "#1e1b4b" }}>{((currentPage - 1) * pageSize) + 1}</span> to <span style={{ fontWeight: 600, color: "#1e1b4b" }}>{Math.min(currentPage * pageSize, totalItems)}</span> of <span style={{ fontWeight: 600, color: "#1e1b4b" }}>{totalItems}</span> entries
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.8rem", background: "white" }}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: currentPage === 1 ? "#f1f5f9" : "white",
                color: currentPage === 1 ? "#94a3b8" : "#1e1b4b",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: currentPage === 1 ? "not-allowed" : "pointer"
              }}
            >
              Previous
            </button>
            <div style={{ display: "flex", alignItems: "center", padding: "0 0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "#1e1b4b" }}>
              Page {currentPage} of {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: currentPage === totalPages ? "#f1f5f9" : "white",
                color: currentPage === totalPages ? "#94a3b8" : "#1e1b4b",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedStudent && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100, padding: "2rem" }}>
          <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1e1b4b", fontWeight: 800 }}>{selectedStudent.name}</h2>
                <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span>{selectedStudent.email}</span>
                  {selectedStudent.student_code && (
                    <span style={{ background: "rgba(255, 184, 0, 0.12)", color: "var(--color-accent-orange-hover)", fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", fontWeight: 700 }}>
                      {selectedStudent.student_code}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} style={{ border: "none", background: "rgba(100, 116, 139, 0.1)", color: "#64748b", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, background: "#f1f5f9" }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#334155", fontSize: "1.1rem", fontWeight: 700 }}>Submission Timeline</h3>
              
              {loadingProfile ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>Loading timeline...</div>
              ) : studentSubmissions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "12px", border: "1px dashed #cbd5e1", color: "#94a3b8" }}>
                  No submissions found for this student yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {studentSubmissions.map((sub: any, index: number) => (
                    <div key={sub.id} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative" }}>
                      
                      {/* Connector Line (unless last) */}
                      {index !== studentSubmissions.length - 1 && (
                        <div style={{ position: "absolute", bottom: "-1rem", left: "2.5rem", width: "2px", height: "1rem", background: "#cbd5e1" }} />
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                            <div style={{ background: "#1e1b4b", color: "white", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                              {studentSubmissions.length - index}
                            </div>
                            <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#1e1b4b" }}>{sub.form_name}</h4>
                          </div>
                          <div style={{ color: "#64748b", fontSize: "0.85rem", marginLeft: "2.75rem" }}>
                            Submitted: {new Date(sub.submitted_at).toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                          <span style={{ 
                            padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                            background: (sub.payment_status === "PAID" || sub.entry_fee == 0) ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                            color: (sub.payment_status === "PAID" || sub.entry_fee == 0) ? "#10b981" : "#d97706"
                          }}>
                            {sub.entry_fee == 0 ? "NO PAYMENT" : (sub.payment_status === "PAID" ? `PAID ₹${sub.entry_fee || '0.00'}` : `PENDING PAYMENT (₹${sub.entry_fee || '0.00'})`)}
                          </span>
                          
                          <span style={{ 
                            padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                            background: sub.is_passed ? "rgba(16, 185, 129, 0.1)" : "rgba(100, 116, 139, 0.1)",
                            color: sub.is_passed ? "#10b981" : "#64748b"
                          }}>
                            {sub.is_passed ? "PASSED" : "EVALUATION PENDING"}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "2rem" }}>
                        <div style={{ flex: 2 }}>
                          <h5 style={{ margin: "0 0 0.5rem 0", color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>Form Responses</h5>
                          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                            {sub.labeled_data && Object.keys(sub.labeled_data).length > 0 ? (
                              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                                {Object.entries(sub.labeled_data).map(([key, value]) => (
                                  <div key={key}>
                                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{key}</div>
                                    <div style={{ fontSize: "0.9rem", color: "#1e293b", fontWeight: 500 }}>{String(value)}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic" }}>No form data provided.</div>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ flex: 1, borderLeft: "1px solid #e2e8f0", paddingLeft: "2rem" }}>
                          <h5 style={{ margin: "0 0 0.5rem 0", color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>Assign Marks</h5>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <input 
                              type="number" 
                              placeholder="Enter marks"
                              value={markInputs[sub.id] || ""}
                              onChange={(e) => setMarkInputs({...markInputs, [sub.id]: e.target.value})}
                              style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem", textAlign: "center", fontWeight: 600 }}
                            />
                            <button 
                              onClick={() => handleUpdateMarks(sub.id)}
                              style={{ border: "none", background: "#1e1b4b", color: "white", padding: "0.6rem 1rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
                            >
                              Save Marks
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentsManagerPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>Loading...</div>}>
      <StudentsManager />
    </Suspense>
  );
}
