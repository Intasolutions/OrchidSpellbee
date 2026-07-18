"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { API_BASE_URL } from "@/config";

export default function ResultsPage() {
  const [searchType, setSearchType] = useState<"student" | "school">("student");
  
  // Student Search State
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // School Search State
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [schoolResults, setSchoolResults] = useState<any[]>([]);
  const [schoolError, setSchoolError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/public/result/?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to fetch results");
      }
    } catch (err) {
      setError("An error occurred while connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolResults = async (page: number, queryParam = schoolQuery) => {
    if (!queryParam.trim()) return;
    
    setSchoolLoading(true);
    setSchoolError(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/school-result/?q=${encodeURIComponent(queryParam.trim())}&page=${page}`);
      const data = await res.json();
      
      if (res.ok) {
        setSchoolResults(data.results || []);
        setCurrentPage(data.current_page || 1);
        setTotalPages(data.total_pages || 1);
      } else {
        setSchoolError(data.error || "Failed to fetch school results");
        setSchoolResults([]);
      }
    } catch (err) {
      setSchoolError("An error occurred while connecting to the server");
      setSchoolResults([]);
    } finally {
      setSchoolLoading(false);
    }
  };

  const handleSchoolSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchSchoolResults(1, schoolQuery);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchSchoolResults(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchSchoolResults(currentPage + 1);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "var(--font-geist-sans)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "180px", paddingBottom: "60px", paddingLeft: "20px", paddingRight: "20px" }}>
        <div style={{ 
          maxWidth: searchType === "school" ? "800px" : "650px", 
          width: "100%", 
          background: "#ffffff", 
          padding: "3.5rem", 
          borderRadius: "24px", 
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
          border: "1px solid #f1f5f9",
          transition: "max-width 0.3s ease"
        }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "2.25rem", color: "#0f172a", fontWeight: 700, marginBottom: "0.75rem", letterSpacing: "-0.5px" }}>Official Results Portal</h1>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>Please select how you want to search for competition results.</p>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", borderBottom: "1px solid #e2e8f0" }}>
            <button
              onClick={() => setSearchType("student")}
              style={{
                padding: "0.75rem 1.5rem",
                background: "none",
                border: "none",
                borderBottom: searchType === "student" ? "2px solid #3b82f6" : "2px solid transparent",
                color: searchType === "student" ? "#3b82f6" : "#64748b",
                fontWeight: searchType === "student" ? 600 : 500,
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Search by Student
            </button>
            <button
              onClick={() => setSearchType("school")}
              style={{
                padding: "0.75rem 1.5rem",
                background: "none",
                border: "none",
                borderBottom: searchType === "school" ? "2px solid #3b82f6" : "2px solid transparent",
                color: searchType === "school" ? "#3b82f6" : "#64748b",
                fontWeight: searchType === "school" ? 600 : 500,
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Search by School
            </button>
          </div>

          {searchType === "student" && (
            <>
              <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Student Code or Email</label>
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. OSB-2026-0001 or email@domain.com"
                    style={{
                      width: "100%",
                      padding: "1rem 1.25rem",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                      backgroundColor: "#f8fafc",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; e.target.style.backgroundColor = "#ffffff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; e.target.style.backgroundColor = "#f8fafc"; }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#ffffff",
                    backgroundColor: "#1e1b4b",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.8 : 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#312e81" }}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e1b4b"}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      View Result
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div style={{ padding: "1.25rem", background: "#fef2f2", color: "#991b1b", borderRadius: "12px", border: "1px solid #f87171", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}

              {result && (
                <div style={{ 
                  marginTop: "2rem", 
                  padding: "2rem", 
                  background: "#ffffff", 
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ 
                      width: "56px", 
                      height: "56px", 
                      background: result.is_passed ? "#dcfce7" : "#fee2e2", 
                      borderRadius: "12px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: result.is_passed ? "#166534" : "#991b1b"
                    }}>
                      {result.is_passed ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      )}
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1.5rem", color: "#0f172a", fontWeight: 700, margin: 0 }}>
                        {result.name}
                      </h2>
                      <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.25rem", margin: 0 }}>
                        {result.student_code}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f8fafc", borderRadius: "10px" }}>
                      <span style={{ color: "#475569", fontWeight: 500, fontSize: "0.95rem" }}>Competition Level</span>
                      <span style={{ color: "#0f172a", fontWeight: 600 }}>{result.latest_tier}</span>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f8fafc", borderRadius: "10px" }}>
                      <span style={{ color: "#475569", fontWeight: 500, fontSize: "0.95rem" }}>Official Score</span>
                      <span style={{ color: "#0f172a", fontWeight: 700, fontSize: "1.1rem" }}>
                        {result.marks !== null ? result.marks : "Not Graded"}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f8fafc", borderRadius: "10px" }}>
                      <span style={{ color: "#475569", fontWeight: 500, fontSize: "0.95rem" }}>Qualification Status</span>
                      {result.marks === null ? (
                        <span style={{ color: "#475569", fontWeight: 600 }}>PENDING</span>
                      ) : result.is_passed ? (
                        <span style={{ color: "#16a34a", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          QUALIFIED
                        </span>
                      ) : (
                        <span style={{ color: "#dc2626", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          NOT QUALIFIED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {searchType === "school" && (
            <>
              <form onSubmit={handleSchoolSearch} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>School Name</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input 
                      type="text" 
                      value={schoolQuery}
                      onChange={(e) => setSchoolQuery(e.target.value)}
                      placeholder="e.g. Delhi Public School"
                      style={{
                        flex: 1,
                        padding: "1rem 1.25rem",
                        borderRadius: "12px",
                        border: "1px solid #cbd5e1",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "all 0.2s ease",
                        backgroundColor: "#f8fafc",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; e.target.style.backgroundColor = "#ffffff"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; e.target.style.backgroundColor = "#f8fafc"; }}
                    />
                    <button 
                      type="submit" 
                      disabled={schoolLoading}
                      style={{
                        padding: "1rem 2rem",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#ffffff",
                        backgroundColor: "#1e1b4b",
                        border: "none",
                        cursor: schoolLoading ? "not-allowed" : "pointer",
                        opacity: schoolLoading ? 0.8 : 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "background-color 0.2s"
                      }}
                      onMouseOver={(e) => { if(!schoolLoading) e.currentTarget.style.backgroundColor = "#312e81" }}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e1b4b"}
                    >
                      {schoolLoading ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>
              </form>

              {schoolError && (
                <div style={{ padding: "1.25rem", background: "#fef2f2", color: "#991b1b", borderRadius: "12px", border: "1px solid #f87171", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {schoolError}
                </div>
              )}

              {schoolResults.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                          <th style={{ padding: "1rem", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>Name</th>
                          <th style={{ padding: "1rem", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>Code</th>
                          <th style={{ padding: "1rem", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>Level</th>
                          <th style={{ padding: "1rem", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>Score</th>
                          <th style={{ padding: "1rem", textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schoolResults.map((r, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.1s" }} onMouseOver={e => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}>
                            <td style={{ padding: "1rem", color: "#0f172a", fontWeight: 500 }}>{r.name}</td>
                            <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.875rem" }}>{r.student_code}</td>
                            <td style={{ padding: "1rem", color: "#334155", fontSize: "0.875rem" }}>{r.latest_tier}</td>
                            <td style={{ padding: "1rem", textAlign: "center", color: "#0f172a", fontWeight: 600 }}>{r.marks !== null ? r.marks : "-"}</td>
                            <td style={{ padding: "1rem", textAlign: "center" }}>
                              {r.marks === null ? (
                                <span style={{ padding: "0.25rem 0.75rem", background: "#f1f5f9", color: "#475569", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>PENDING</span>
                              ) : r.is_passed ? (
                                <span style={{ padding: "0.25rem 0.75rem", background: "#dcfce7", color: "#166534", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>PASS</span>
                              ) : (
                                <span style={{ padding: "0.25rem 0.75rem", background: "#fee2e2", color: "#991b1b", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>FAIL</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1.5rem" }}>
                      <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        style={{ padding: "0.5rem 1rem", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff", color: currentPage === 1 ? "#94a3b8" : "#334155", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                      >
                        Previous
                      </button>
                      <span style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: 500 }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={{ padding: "0.5rem 1rem", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff", color: currentPage === totalPages ? "#94a3b8" : "#334155", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
