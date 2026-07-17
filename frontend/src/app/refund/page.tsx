"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function RefundPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '8rem 20px 4rem 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <button 
          onClick={() => router.back()} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-accent-orange)', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '1rem' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Refund & Cancellation Policy</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p><strong>Effective Date:</strong> July 2026</p>
          <p>Thank you for registering for the Orchid SpellBee Championship. Please read our Refund & Cancellation Policy carefully before completing your registration.</p>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Registration Fees</h2>
            <p>All registration fees paid for the Orchid SpellBee Championship are generally <strong>non-refundable and non-transferable</strong>, except in the circumstances specifically mentioned in this policy.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. Cancellation by Participant</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Once a registration has been successfully completed, it cannot be cancelled by the participant.</li>
              <li>Failure to participate in any stage of the competition, whether due to personal reasons, travel issues, illness, or any other circumstance, will not entitle the participant to a refund.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. Duplicate or Incorrect Payments</h2>
            <p style={{ marginBottom: '0.5rem' }}>If a participant is charged more than once for the same registration due to a technical or payment error:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>The duplicate payment will be verified by Orchid SpellBee.</li>
              <li>Once confirmed, the excess amount will be refunded to the original payment method.</li>
              <li>Refunds, where approved, will generally be processed within <strong>7–10 business days</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Cancellation by Orchid SpellBee</h2>
            <p style={{ marginBottom: '0.5rem' }}>If Orchid SpellBee cancels a competition, event, or registration due to unforeseen circumstances or operational reasons, the organizing committee may, at its sole discretion:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Reschedule the competition, or</li>
              <li>Provide a full or partial refund, where applicable.</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>The decision of the organizing committee shall be final.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>5. Payment Failures</h2>
            <p style={{ marginBottom: '0.5rem' }}>If a payment fails but the amount is debited from your account:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Please allow sufficient time for your bank or payment provider to process the transaction.</li>
              <li>If the registration is not confirmed, contact our support team with the payment reference number.</li>
              <li>Any eligible refund will be processed after verification.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>6. Refund Processing</h2>
            <p>Approved refunds will be credited to the original payment method used during registration. The actual credit date may vary depending on the bank or payment gateway.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>7. Non-Refundable Situations</h2>
            <p style={{ marginBottom: '0.5rem' }}>Refunds will not be provided for:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Change of mind after registration.</li>
              <li>Incorrect information submitted by the participant.</li>
              <li>Failure to attend or participate.</li>
              <li>Disqualification due to violation of competition rules.</li>
              <li>Missed deadlines or late arrivals.</li>
              <li>Any circumstances beyond the reasonable control of Orchid SpellBee.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>8. Contact for Refund Requests</h2>
            <p>For refund-related enquiries or duplicate payment claims, please contact Orchid SpellBee through the contact details available on the official website. Please include your registration ID, participant name, payment reference number, and proof of payment to help us process your request promptly.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>9. Policy Updates</h2>
            <p>Orchid SpellBee reserves the right to modify this Refund & Cancellation Policy at any time. Any updates will be published on the official website and will take effect immediately upon publication.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
