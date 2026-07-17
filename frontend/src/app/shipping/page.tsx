"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ShippingPage() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Shipping & Delivery Policy</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p><strong>Effective Date:</strong> July 2026</p>
          <p>This Shipping & Delivery Policy explains how Orchid SpellBee Championship delivers official textbooks and study materials to eligible registered participants.</p>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Eligibility</h2>
            <p>Official textbooks and study materials are provided <strong>only to participants who have successfully completed their registration</strong>, including payment of the applicable registration fee, where such materials are included in the registration package.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. Shipping Coverage</h2>
            <p>Textbooks are shipped to the address provided during registration. Participants are responsible for ensuring that the shipping address and contact details are accurate and complete.</p>
            <p>Orchid SpellBee is not responsible for delays or non-delivery resulting from incorrect or incomplete address information.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. Delivery Timeline</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Orders are typically dispatched within <strong>7–10 business days</strong> after successful registration and payment verification.</li>
              <li>Delivery timelines may vary depending on the participant's location, courier availability, public holidays, or unforeseen circumstances.</li>
              <li>Participants will be notified if there are significant delays in dispatch.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Shipping Charges</h2>
            <p>Any applicable shipping charges will be communicated during the registration process. Where shipping is offered free of charge, this will be clearly indicated at the time of registration.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>5. Delivery Attempts</h2>
            <p>Deliveries will be made by our courier partners. If delivery cannot be completed due to the recipient's unavailability or incorrect address details, additional delivery charges may apply for re-dispatch, where applicable.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>6. Damaged or Missing Shipments</h2>
            <p>If you receive damaged textbooks or your shipment is incomplete, please contact Orchid SpellBee within <strong>7 days</strong> of delivery. We will review the issue and, where appropriate, arrange for a replacement.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>7. Tracking</h2>
            <p>Where available, shipment tracking details may be shared with participants via email, SMS, or WhatsApp after dispatch.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>8. Contact Us</h2>
            <p>For any shipping or delivery-related enquiries, please contact Orchid SpellBee using the contact details provided on our official website.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
