"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShippingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '8rem 20px 4rem 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Shipping and Delivery Policy</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Digital Services</h2>
            <p>Orchid SpellBee provides digital services, including online registrations for competitions, mock tests, and digital access to the student dashboard. As such, we do not ship any physical items or products to your address as part of the standard registration fee.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. Delivery of Access</h2>
            <p>Upon successful payment of your registration fee, your account will instantly be marked as "Paid" and you will gain immediate access to the relevant dashboard features. You will also receive an email confirmation containing your transaction details and student code.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. Physical Books (If Applicable)</h2>
            <p>If you separately purchase physical study materials or books from us, the shipping terms will be provided at the time of purchase. Standard delivery for physical items within India is typically 5-10 business days.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Contact Us</h2>
            <p>If you face any issues accessing your digital dashboard after a successful payment, please reach out to us at:<br/><br/>
            Email: info@orchidspellbee.com<br/>
            Phone: 756 09 97 700</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
