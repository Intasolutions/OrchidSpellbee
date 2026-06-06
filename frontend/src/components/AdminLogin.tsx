"use client";

import { useState } from "react";
import { loginAction } from "../app/admin/actions";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await loginAction(username, password);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7', color: '#222222' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff385c', marginBottom: '0.5rem' }}>Admin Access</h1>
        <p style={{ color: '#717171', fontSize: '0.9rem', marginBottom: '2rem' }}>Please log in using your Django Admin credentials.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ebebeb', outline: 'none', background: '#f8f9fa', fontSize: '1rem' }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ebebeb', outline: 'none', background: '#f8f9fa', fontSize: '1rem' }}
            required
          />
          {error && <div style={{ color: '#ff385c', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left' }}>{error}</div>}
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: '#222222', color: 'white', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem' }}
          >
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
