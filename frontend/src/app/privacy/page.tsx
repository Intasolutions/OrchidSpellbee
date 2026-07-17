"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Privacy Policy</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p><strong>Effective Date:</strong> July 2026</p>
          <p>Orchid SpellBee Championship ("Orchid SpellBee", "we", "our", or "us") is committed to protecting the privacy of students, parents, teachers, schools, and website visitors. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website or participate in the competition.</p>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '0.5rem' }}>We may collect the following information during registration or while using our website:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Student's name, age, class, and date of birth</li>
              <li>Parent/Guardian's name and contact details</li>
              <li>School name and location</li>
              <li>Email address and mobile number</li>
              <li>Billing and payment information</li>
              <li>Competition registration details</li>
              <li>Website usage information such as IP address, browser type, device information, and cookies</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: '0.5rem' }}>We use the information collected to:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Process registrations and payments</li>
              <li>Communicate important competition updates</li>
              <li>Verify participant eligibility</li>
              <li>Organize and conduct the championship</li>
              <li>Issue certificates, medals, trophies, and prizes</li>
              <li>Respond to enquiries and customer support requests</li>
              <li>Improve our website and user experience</li>
              <li>Send important announcements and promotional updates related to Orchid SpellBee (users may opt out of promotional communications at any time)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. Payment Information</h2>
            <p>Online payments are processed through secure third-party payment gateway providers. Orchid SpellBee does not store complete debit card, credit card, UPI, or banking credentials on its servers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Cookies</h2>
            <p style={{ marginBottom: '0.5rem' }}>Our website may use cookies and similar technologies to:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Improve website performance</li>
              <li>Remember user preferences</li>
              <li>Analyse website traffic</li>
              <li>Enhance user experience</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>Users may disable cookies through their browser settings; however, certain website features may not function properly.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>5. Information Sharing</h2>
            <p style={{ marginBottom: '0.5rem' }}>We do not sell, rent, or trade personal information.</p>
            <p style={{ marginBottom: '0.5rem' }}>Information may be shared only with:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Payment gateway providers for payment processing</li>
              <li>Technology and hosting service providers</li>
              <li>Schools for competition coordination where applicable</li>
              <li>Government or legal authorities when required by applicable law</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>6. Data Security</h2>
            <p>We implement reasonable administrative, technical, and organizational safeguards to protect personal information from unauthorized access, misuse, alteration, or disclosure. While we strive to protect your information, no method of internet transmission or electronic storage is completely secure.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>7. Children's Privacy</h2>
            <p>Since the competition is intended for school students, personal information relating to children is collected only for competition administration and is expected to be provided with the knowledge and consent of the parent, guardian, or the participating school.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>8. Photography and Media</h2>
            <p>During competitions and related events, photographs and videos may be captured. These may be used by Orchid SpellBee for educational, promotional, marketing, website, social media, and publicity purposes without additional compensation.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>9. Data Retention</h2>
            <p>We retain personal information only for as long as reasonably necessary to administer the competition, comply with legal obligations, resolve disputes, and maintain records.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>10. Your Rights</h2>
            <p style={{ marginBottom: '0.5rem' }}>You may request to:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Update contact details</li>
              <li>Request deletion of personal information, subject to legal or operational requirements</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>Requests may be submitted using the contact details provided below.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>11. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. Orchid SpellBee is not responsible for the privacy practices or content of external websites. Users should review the privacy policies of those websites separately.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>12. Changes to this Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will become effective once published on this website. Continued use of the website constitutes acceptance of the updated Privacy Policy.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>13. Contact Us</h2>
            <p>For any questions regarding this Privacy Policy or your personal information, please contact us through the official Orchid SpellBee website or the contact details provided on the website.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
