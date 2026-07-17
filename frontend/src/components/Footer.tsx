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
             <strong>Kerala Region:</strong> +91 7560 99 77 00 | +91 8606 69 88 24<br/>
             <strong>Karnataka Region:</strong> +91 63662 22500 | +91 98863 30905<br/>
             <strong>Email:</strong> info@orchidspellbee.com<br/>
             <strong>Website:</strong> www.orchidspellbee.com
           </p>
        </div>
        
        {/* Opening Hours */}
        <div className="reveal-up delay-300" style={{ flex: '1 1 200px' }}>
           <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-heading)', marginBottom: '1.5rem', fontWeight: '800' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-orange)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             Opening Hours
           </h4>
           <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.8', margin: 0 }}>
             <strong>Mon-Sat:</strong> 9AM - 5PM<br/>
             <strong>Sunday:</strong> Closed
           </p>
         </div>
         
         {/* Legal */}
         <div className="reveal-up delay-350" style={{ flex: '1 1 200px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-heading)', marginBottom: '1.5rem', fontWeight: '800' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-orange)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/terms" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Terms and Conditions</Link>
              <Link href="/privacy" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/refund" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Refund Policy</Link>
              <Link href="/shipping" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Shipping Policy</Link>
            </div>
         </div>
        
        {/* Follow Us */}
        <div className="reveal-up delay-400" style={{ flex: '1 1 200px' }}>
           <h4 style={{ color: 'var(--color-text-heading)', marginBottom: '1.5rem', fontWeight: '800' }}>Follow Us</h4>
           <div style={{ display: 'flex', gap: '1rem' }}>
             <Link href="https://www.youtube.com/@OrchidSpellBee" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', textDecoration: 'none' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
             </Link>
             <Link href="https://www.facebook.com/people/Orchid-Spell-Bee-Pvt-Ltd/61590231147837/" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', textDecoration: 'none' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
             </Link>
             <Link href="https://www.instagram.com/orchidspellbee?igsh=MWs4aGhpY3V2cGE5Nw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', textDecoration: 'none' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
             </Link>
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
