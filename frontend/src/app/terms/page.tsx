"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text-heading)' }}>Terms & Conditions</h1>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p><strong>Effective Date:</strong> July 2026</p>
          <p>Welcome to Orchid SpellBee Championship. By registering for and participating in the competition, participants, parents/guardians, and schools agree to the following Terms & Conditions.</p>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>1. Eligibility</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>The competition is open to students studying in the eligible classes specified for the current academic year.</li>
              <li>Participants must provide accurate personal and school details during registration.</li>
              <li>Orchid SpellBee reserves the right to verify participant information at any stage.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>2. Registration</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Registration is considered complete only after successful payment of the applicable registration fee.</li>
              <li>Registration fees are non-transferable.</li>
              <li>Each participant may register only once for the same academic year.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>3. Competition Structure</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>The championship will be conducted in multiple levels, including School, District, State, and National Levels, subject to the official competition format.</li>
              <li>Qualification to the next level is based solely on the participant's performance and the eligibility criteria announced by Orchid SpellBee.</li>
              <li>The organizing committee reserves the right to modify the competition format, dates, or venue if necessary.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>4. Study Materials</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Official study materials, if included with registration, are intended solely for registered participants.</li>
              <li>Reproduction, distribution, or commercial use of any study material without written permission is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>5. Code of Conduct</h2>
            <p style={{ marginBottom: '0.5rem' }}>Participants are expected to:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Maintain discipline and respect during all stages of the competition.</li>
              <li>Refrain from cheating, impersonation, or any unfair practices.</li>
              <li>Follow all instructions provided by organizers, coordinators, and judges.</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>Any violation may result in immediate disqualification without refund.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>6. Results & Judging</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>The decision of the judges and organizing committee shall be final and binding.</li>
              <li>Requests for re-evaluation or reconsideration of results will not be entertained.</li>
              <li>Orchid SpellBee reserves the right to verify scores before publishing final results.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>7. Awards & Prizes</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Prizes, certificates, medals, and trophies will be awarded according to the official prize structure.</li>
              <li>If a participant is found ineligible or violates the competition rules, the award may be withdrawn.</li>
              <li>Orchid SpellBee reserves the right to substitute prizes with equivalent alternatives if required.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>8. Fees & Refund Policy</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Registration fees are non-refundable under normal circumstances.</li>
              <li>Refunds will only be considered in cases of duplicate payment or transaction errors, subject to verification.</li>
              <li>Failure to attend the competition does not qualify for a refund.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>9. Photography & Media Consent</h2>
            <p>By participating, parents/guardians and schools grant Orchid SpellBee permission to use photographs, videos, participant names, and competition-related content for educational, promotional, marketing, and publicity purposes across print, digital, and social media platforms without additional compensation.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>10. Privacy</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Personal information collected during registration will be used solely for competition administration, communication, and related educational activities.</li>
              <li>Orchid SpellBee will take reasonable measures to protect participant information and will not sell personal data to third parties except where required by law.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>11. Intellectual Property</h2>
            <p>All content on the Orchid SpellBee website, including logos, branding, study materials, graphics, videos, and text, is the intellectual property of Orchid SpellBee and may not be copied, reproduced, or distributed without prior written permission.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>12. Limitation of Liability</h2>
            <p>Orchid SpellBee shall not be liable for any direct, indirect, incidental, or consequential loss arising from participation in the competition, website usage, technical interruptions, or unforeseen circumstances beyond its reasonable control.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>13. Amendments</h2>
            <p>Orchid SpellBee reserves the right to amend these Terms & Conditions, competition rules, schedules, eligibility criteria, or prize structure at any time without prior notice. Updated terms will be published on the official website.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>14. Governing Law</h2>
            <p>These Terms & Conditions shall be governed by the laws of India. Any disputes arising from participation in the competition shall be subject to the jurisdiction of the competent courts in Kerala, India.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>15. Contact</h2>
            <p>For any queries regarding the competition, registration, or these Terms & Conditions, please contact the Orchid SpellBee support team through the official website or registered communication channels.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
