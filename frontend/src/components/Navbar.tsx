"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistrationActive, setIsRegistrationActive] = useState(true);
  const [isResultsPublished, setIsResultsPublished] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem('student_token'));
    }
    fetch(`${API_BASE_URL}/api/settings/`)
      .then(res => res.json())
      .then(data => {
        setIsRegistrationActive(data.is_registration_active);
        setIsResultsPublished(data.is_results_published);
      })
      .catch(() => setIsRegistrationActive(true));
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COMPETITIONS', path: '/competitions' },
    { name: 'ROUNDS & PRIZES', path: '/rounds-and-prizes' },
    { name: 'OUR BOOKS', path: '/our-books' },
    { name: 'CONTACT', path: '/contact' }
  ];

  if (isResultsPublished) {
    navLinks.splice(3, 0, { name: 'RESULTS', path: '/results' });
  }

  return (
    <header className="animate-drop-down" style={{ 
      position: 'sticky', 
      top: '20px', 
      zIndex: 50, 
      display: 'flex', 
      justifyContent: 'center',
      padding: '0 20px',
      pointerEvents: 'none',
      marginBottom: '-80px', // Pull content up behind it since it's floating
    }}>
      <nav style={{ 
        pointerEvents: 'auto',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '50px',
        padding: '0.5rem 1.5rem 0.5rem 2rem', 
        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -5px rgba(0, 0, 0, 0.03)',
        color: 'var(--color-text-heading)', 
        width: '100%',
        maxWidth: '1200px',
        position: 'relative'
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/img/logo.png" 
            alt="Orchid SpellBee Logo" 
            style={{ height: '52px', width: 'auto', display: 'block' }} 
          />
        </Link>
        
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`nav-link ${pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

          {/* Desktop Right Side - Button & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isRegistrationActive && (
              isLoggedIn && pathname === '/' ? (
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openRegisterModal'))} 
                  className="btn desktop-login-btn" 
                  style={{ borderRadius: '25px', padding: '0.5rem 1.2rem', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Login to register
                </button>
              ) : (
                <Link href={isLoggedIn ? "/?register=true" : "/login"} style={{ textDecoration: 'none' }} className="desktop-login-btn">
                  <button className="btn" style={{ borderRadius: '25px', padding: '0.5rem 1.2rem', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                    {isLoggedIn ? "Login to register" : "Login to Register"}
                  </button>
                </Link>
              )
            )}

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-heading)',
                padding: '0.5rem',
                outline: 'none'
              }}
              aria-label="Toggle navigation menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-menu" style={{
            position: 'absolute',
            top: '75px',
            left: '0',
            right: '0',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            zIndex: 100
          }}>
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`nav-link ${pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  textAlign: 'center',
                  padding: '0.85rem'
                }}
              >
                {link.name}
              </Link>
            ))}
            {isRegistrationActive && (
              isLoggedIn && pathname === '/' ? (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('openRegisterModal'));
                  }} 
                  className="btn" 
                  style={{ width: '100%', borderRadius: '12px', padding: '0.85rem', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}
                >
                  Dashboard / Register
                </button>
              ) : (
                <Link 
                  href={isLoggedIn ? "/?register=true" : "/login"} 
                  style={{ textDecoration: 'none', marginTop: '0.5rem' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="btn" style={{ width: '100%', borderRadius: '12px', padding: '0.85rem', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>
                    {isLoggedIn ? "Dashboard / Register" : "Login to Register"}
                  </button>
                </Link>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
