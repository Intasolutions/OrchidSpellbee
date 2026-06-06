"use client";

import { logoutAction } from "../app/admin/actions";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => logoutAction()}
      style={{ padding: '0.8rem 1rem', borderRadius: '8px', color: '#ff385c', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textAlign: 'left', marginTop: 'auto' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      Secure Logout
    </button>
  );
}
