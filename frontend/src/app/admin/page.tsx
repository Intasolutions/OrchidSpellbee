"use client";
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/submissions/`)
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.5px' }}>Registrations</h1>
        <button style={{ background: '#222222', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Export CSV
        </button>
      </div>
      
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 6px 16px rgba(0,0,0,0.04)', border: '1px solid #ebebeb' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ebebeb' }}>
                <th style={{ padding: '1rem', color: '#717171', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Name</th>
                <th style={{ padding: '1rem', color: '#717171', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</th>
                <th style={{ padding: '1rem', color: '#717171', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tier / Form</th>
                <th style={{ padding: '1rem', color: '#717171', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Status</th>
                <th style={{ padding: '1rem', color: '#717171', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#717171' }}>Loading submissions...</td></tr>
              ) : submissions.map((sub: any) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #ebebeb', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#f7f7f7'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.2rem 1rem', fontWeight: 500, color: '#222222' }}>{sub.student_name}</td>
                  <td style={{ padding: '1.2rem 1rem', color: '#717171' }}>{sub.student_email}</td>
                  <td style={{ padding: '1.2rem 1rem', color: '#222222' }}>{sub.form_name}</td>
                  <td style={{ padding: '1.2rem 1rem' }}>
                    <span style={{ 
                      background: sub.payment_status === 'SUCCESS' ? '#e6f4ea' : '#fef3c7', 
                      color: sub.payment_status === 'SUCCESS' ? '#137333' : '#b45309', 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {sub.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 1rem', color: '#717171', fontSize: '0.9rem' }}>
                    {new Date(sub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {!loading && submissions.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#717171' }}>No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
