"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RefundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '8rem 20px 4rem 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Refund and Cancellation Policy</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Registration Fees</h2>
            <p>All fees paid towards registration for Orchid SpellBee competitions are strictly non-refundable and non-transferable under any circumstances.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. Technical Issues & Double Payments</h2>
            <p>In the rare event that a technical issue causes your account to be charged twice for a single registration, please contact our support team within 7 days. We will verify the transaction and initiate a refund for the duplicate payment. The refund may take 5-7 business days to reflect in your original payment method.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. Cancellations</h2>
            <p>Once registered, you cannot cancel your participation to claim a refund. If you choose not to participate in the competition, your fee is forfeited.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Event Modifications</h2>
            <p>Orchid SpellBee reserves the right to postpone or change the mode (online/offline) of the competition due to unforeseen circumstances. Such changes will not entitle participants to a refund.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>5. Contact Us</h2>
            <p>For any billing inquiries, please contact us at:<br/><br/>
            Email: info@orchidspellbee.com<br/>
            Phone: 756 09 97 700</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
