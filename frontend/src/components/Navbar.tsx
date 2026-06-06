"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COMPETITIONS', path: '/competitions' },
    { name: 'OUR BOOKS', path: '/our-books' },
    { name: 'ROUNDS & PRIZES', path: '/rounds-and-prizes' },
    { name: 'TEAM', path: '/team' },
    { name: 'CONTACT', path: '/contact' }
  ];

  return (
    <header style={{ 
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
        padding: '0.5rem 1rem 0.5rem 2rem', 
        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -5px rgba(0, 0, 0, 0.03)',
        color: 'var(--color-text-heading)', 
        width: '100%',
        maxWidth: '1200px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              <span style={{color: 'var(--color-text-heading)'}}>Orchid</span>
              <span style={{color: 'var(--color-accent-orange)'}}>SpellBee</span>
              <div style={{fontSize: '0.6rem', color: 'var(--color-text-secondary)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Private Limited</div>
            </div>
          </Link>
        </div>
      <div className="nav-links" style={{ display: 'flex', gap: '1.8rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
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
    </nav>
    </header>
  );
}
