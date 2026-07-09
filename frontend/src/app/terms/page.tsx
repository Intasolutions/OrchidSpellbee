"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '8rem 20px 4rem 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Terms and Conditions</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Introduction</h2>
            <p>Welcome to Orchid SpellBee Private Limited. By accessing our website and participating in our competitions, you agree to be bound by these Terms and Conditions.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. Registrations & Payments</h2>
            <p>All registrations are subject to verification. Payment must be completed successfully through our secure payment gateway to confirm your participation. Fees once paid are subject to our Refund Policy.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. User Conduct</h2>
            <p>Participants are expected to maintain fair play and integrity during all competitions. Any form of malpractice may lead to immediate disqualification without refund.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Intellectual Property</h2>
            <p>All content on this website, including logos, study materials, and competition formats, is the intellectual property of Orchid SpellBee Private Limited and may not be copied or reproduced without permission.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>5. Contact</h2>
            <p>If you have any questions regarding these Terms, please contact us at info@orchidspellbee.com.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
