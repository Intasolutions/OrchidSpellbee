"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('student_token', data.token);
        localStorage.setItem('student_id', data.student_id);
        router.push('/?register=true'); // Redirect to dashboard and open modal
      } else {
        // Handle validation errors from Django (could be an array or object)
        const errMsg = typeof data === 'object' ? Object.values(data).join(' ') : 'Registration failed.';
        setError(errMsg);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('student_token', data.token);
        localStorage.setItem('student_id', data.student_id);
        router.push('/?register=true');
      } else {
        setError(data.error || 'Google Registration failed.');
      }
    } catch (err) {
      setError('An error occurred during Google registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', paddingTop: '100px', paddingBottom: '40px' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-heading)' }}>Student Registration</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Create your Orchid SpellBee account</p>
        </div>

        {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError('Google registration failed.');
            }}
            useOneTap
            shape="rectangular"
            theme="outline"
            text="signup_with"
            size="large"
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>Email Address (Username)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn" disabled={isLoading} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px' }}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--color-accent-orange)', fontWeight: 600, textDecoration: 'none' }}>Sign In here</Link>
        </p>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
}
