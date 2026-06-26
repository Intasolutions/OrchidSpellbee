"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#f8f9fa', borderTop: '1px solid #e2e8f0', padding: '4rem 0 0 0', position: 'relative', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between', marginBottom: '3rem' }}>
        
        {/* Brand Logo */}
        <div className="reveal-up delay-0" style={{ flex: '1.2 1 240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
            <img src="/img/logo.png" alt="Orchid SpellBee Logo" style={{ height: '45px', width: 'auto' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: 1.1, color: 'var(--color-text-heading)' }}>
              <span>Orchid</span>
              <span style={{color: 'var(--color-accent-orange)'}}>SpellBee</span>
              <div style={{fontSize: '0.55rem', color: 'var(--color-text-secondary)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase'}}>Private Limited</div>
            </div>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
            Dedicated to engaging children in the enriching practice of English language skills and fostering linguistic growth.
          </p>
        </div>
        {/* Address */}
        <div className="reveal-up delay-100" style={{ flex: '1 1 200px' }}>
           <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-heading)', marginBottom: '1.5rem', fontWeight: '800' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-orange)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
             Address
           </h4>
           <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', margin: 0 }}>
             Orchid Spell Bee<br/>
             XXI/152, Panadan comazone,<br/>
             Cochin University P.O, Kalamassery<br/>
             Cochin, Kerala - 682 022
           </p>
        </div>
        
        {/* Contact */}
        <div className="reveal-up delay-200" style={{ flex: '1 1 200px' }}>
           <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-heading)', marginBottom: '1.5rem', fontWeight: '800' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-orange)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             Contact
           </h4>
           <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', margin: 0 }}>
             <strong>Phone:</strong> 756 09 97 700<br/>
             <strong>Email:</strong> info@orchidspellbee.com
           </p>
        </div>
        
        {/* Opening Hours */}
        <div className="reveal-up delay-300" style={{ flex: '1 1 200px' }}>
           <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-heading)', marginBottom: '1.5rem', fontWeight: '800' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-orange)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             Opening Hours
           </h4>
           <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', margin: 0 }}>
             <strong>Mon-Sat:</strong> 10AM - 5PM<br/>
             <strong>Sunday:</strong> Closed
           </p>
        </div>
        
        {/* Follow Us */}
        <div className="reveal-up delay-400" style={{ flex: '1 1 200px' }}>
           <h4 style={{ color: 'var(--color-text-heading)', marginBottom: '1.5rem', fontWeight: '800' }}>Follow Us</h4>
           <div style={{ display: 'flex', gap: '1rem' }}>
             {[
               <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
               <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
               <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
             ].map((icon, i) => (
               <Link key={i} href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', textDecoration: 'none' }}>
                 {icon}
               </Link>
             ))}
           </div>
        </div>
        
      </div>
      
      {/* Copyright Footer */}
      <div style={{ borderTop: '1px solid #e2e8f0', padding: '1.5rem 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
        © Copyright <strong>OrchidSpellBee</strong> All Rights Reserved
      </div>
      
      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ position: 'absolute', bottom: '1.5rem', right: '2rem', width: '40px', height: '40px', background: 'var(--color-accent-orange)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
      </button>
    </footer>
  );
}
