"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '8rem 20px 4rem 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Privacy Policy</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
            <p>We collect personal information such as your name, email address, phone number, and school details when you register for an account or sign up for a competition on our platform.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. How We Use Your Information</h2>
            <p>Your information is used strictly to manage your competition registrations, process payments, provide customer support, and send important updates regarding your account or upcoming events.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. Data Protection</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. Payment transactions are processed through secure, third-party payment gateways (like Razorpay) and we do not store your credit card or bank details on our servers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Third-Party Disclosure</h2>
            <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice, or as required by law.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>5. Contact Us</h2>
            <p>If there are any questions regarding this privacy policy, you may contact us using the information below:<br/><br/>
            Orchid SpellBee Private Limited<br/>
            Email: info@orchidspellbee.com<br/>
            Phone: 756 09 97 700</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
