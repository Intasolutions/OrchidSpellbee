"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config";
import PrizeScrollSection from "@/app/components/PrizeScrollSection";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [activeForm, setActiveForm] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [student, setStudent] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [formStatus, setFormStatus] = useState<string>('loading');
  const [statusMessage, setStatusMessage] = useState('');
  const [isRegistrationActive, setIsRegistrationActive] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/`)
      .then(res => res.json())
      .then(data => setIsRegistrationActive(data.is_registration_active))
      .catch(() => setIsRegistrationActive(true));

    const token = localStorage.getItem('student_token');
    if (!token) {
      setAuthChecked(true);
      setFormStatus('ready');
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/me/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Auth failed');
      })
      .then(data => setStudent(data))
      .catch(() => {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_id');
      })
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    
    const token = localStorage.getItem('student_token');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    fetch(`${API_BASE_URL}/api/forms/active/`, { headers })
      .then(async res => {
        const data = await res.json();
        if (res.ok && !data.detail) {
          setActiveForm(data);
          setFormStatus('ready');
          const initialData: any = {};
          if (data.fields) {
            data.fields.forEach((f: any) => {
              initialData[f.id] = '';
            });
          }
          setFormData(initialData);
        } else {
          setFormStatus(data.status || 'error');
          setStatusMessage(data.detail || 'No active forms.');
        }
      })
      .catch(err => {
        console.error("Failed to fetch form", err);
        setFormStatus('error');
      });
  }, [authChecked]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("register") === "true") {
        setIsModalOpen(true);
      }

      // Set up scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

      const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-up');
      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;
    setIsSubmitting(true);

    let studentName = "Unknown Student";
    let studentEmail = ""; // Dynamically find email if exists
    activeForm.fields.forEach((f: any) => {
      if (f.label.toLowerCase().includes('name') && formData[f.id]) {
        studentName = formData[f.id];
      }
      if ((f.field_type === 'email' || f.label.toLowerCase().includes('email')) && formData[f.id]) {
        studentEmail = formData[f.id];
      }
    });

    const filteredFormData: any = {};
    activeForm.fields.forEach((f: any) => {
      let isVisible = true;
      if (f.depends_on && f.depends_on_value) {
        const parentField = activeForm.fields.find((pf: any) => pf.label === f.depends_on);
        if (!parentField || formData[parentField.id] !== f.depends_on_value) {
          isVisible = false;
        }
      }
      if (isVisible) {
        filteredFormData[f.id] = formData[f.id];
      }
    });

    const payload = {
      student_name: studentName,
      student_email: studentEmail,
      form_id: activeForm.id,
      data: filteredFormData
    };

    const token = localStorage.getItem('student_token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Token ${token}`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/submit/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        
        if (data.razorpay_order_id) {
          // Load Razorpay script dynamically
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: "INR",
                name: "Orchid Spellbee",
                description: "Entry Fee",
                order_id: data.razorpay_order_id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch(`${API_BASE_URL}/api/verify-payment/`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        
                        if (verifyRes.ok) {
                            setSubmitSuccess(true);
                        } else {
                            const errText = await verifyRes.text();
                            alert("Payment verification failed on server: " + errText);
                        }
                    } catch (err) {
                        alert("Error verifying payment");
                    }
                },
                prefill: {
                    name: studentName,
                    email: studentEmail
                },
                theme: {
                    color: "#6c63ff"
                }
            };
            
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();
          };
          script.onerror = () => {
             alert("Razorpay SDK failed to load. Are you online?");
          };
          document.body.appendChild(script);

        } else {
          setSubmitSuccess(true);
        }
      } else {
        const errorText = await res.text();
        console.error("Submission failed", errorText);
        alert("Submission failed: " + errorText);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="page-layout">
      {/* Hero Section */}
      <div className="hero-section" style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8rem 3rem 6rem 3rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        minHeight: '70vh',
        gap: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract Background Element */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,184,0,0.08) 0%, rgba(255,184,0,0) 70%)', borderRadius: '50%', zIndex: 0 }}></div>
        
        {/* Left Content */}
        <div className="hero-left reveal-left" style={{ flex: '1', position: 'relative', zIndex: 1, paddingLeft: '2rem' }}>
          <div className="animate-reveal-up" style={{ 
            padding: '0.5rem 1.5rem', 
            background: 'rgba(255,184,0,0.1)', 
            color: 'var(--color-accent-orange-hover)', 
            borderRadius: '30px', 
            fontWeight: '700', 
            fontSize: '0.85rem',
            marginBottom: '2rem',
            letterSpacing: '1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: 'fit-content'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
            THE ULTIMATE SPELLING COMPETITION
          </div>
          <h1 className="animate-reveal-up delay-100" style={{ 
            fontSize: '4.5rem', 
            lineHeight: '1.1', 
            marginBottom: '1.5rem', 
            fontWeight: '800',
            letterSpacing: '-1.5px',
            color: 'var(--color-text-heading)'
          }}>
            Spell to Excel, <br/>
            <span style={{ color: 'var(--color-accent-orange)' }}>Conquer</span> and Shine!
          </h1>
          <p className="animate-reveal-up delay-200" style={{ 
            fontSize: '1.2rem', 
            color: 'var(--color-text-secondary)', 
            marginBottom: '3rem',
            maxWidth: '520px',
            lineHeight: '1.7'
          }}>
            Join thousands of students in a celebration of the English language. Improve your linguistic prowess and embark on a journey of self-improvement.
          </p>
          <div className="animate-reveal-up delay-300" style={{ display: 'flex', gap: '1rem' }}>
            {isRegistrationActive && (
              student ? (
                <button 
                  className="btn" 
                  style={{ fontSize: '1.1rem', borderRadius: '8px', padding: '1rem 2.5rem', boxShadow: '0 10px 25px rgba(255,184,0,0.3)' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Login to register
                </button>
              ) : (
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <button 
                    className="btn" 
                    style={{ fontSize: '1.1rem', borderRadius: '8px', padding: '1rem 2.5rem', boxShadow: '0 10px 25px rgba(255,184,0,0.3)' }}
                  >
                    Login to Register
                  </button>
                </Link>
              )
            )}
            <a href="https://wa.me/917560997700" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '1.1rem', borderRadius: '8px', padding: '1rem 2.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> 
                Join WhatsApp
              </button>
            </a>
          </div>
        </div>

        {/* Right Content - Images */}
        <div className="hero-right animate-reveal-up delay-200" style={{ flex: '1', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="hero-right-inner" style={{ position: 'relative', width: '500px', height: '540px' }}>
            {/* Main Image */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'url("/img/6.jpeg") center/cover', 
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
              border: '8px solid white'
            }}></div>
            
            {/* Floating Element 1 */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '-12%',
              background: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              animation: 'float 6s ease-in-out infinite'
            }}>
              <div style={{ width: '45px', height: '45px', background: '#f8f9fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-heading)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-text-heading)' }}>10,000+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Students Enrolled</div>
              </div>
            </div>

            {/* Floating Element 2 */}
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '-12%',
              background: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              animation: 'float 5s ease-in-out infinite 2s'
            }}>
               <div style={{ width: '45px', height: '45px', background: 'rgba(255,184,0,0.1)', color: 'var(--color-accent-orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
               </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-text-heading)' }}>4 Levels</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>School to National</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="container about-section" style={{ padding: '4rem 2rem' }}>
        <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-heading)' }}>About US</h2>
          <div style={{ width: '60px', height: '3px', background: 'var(--color-accent-orange)', margin: '0 auto' }}></div>
        </div>
        
        <div className="about-inner" style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
          <div className="reveal-left" style={{ flex: 1 }}>
            <h4 style={{ color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', fontSize: '0.9rem' }}>WHO WE ARE</h4>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>Welcome to Orchid Spell Bee</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
              where we engage children in the enriching practice of English language skills. Based in Thrissur, we are dedicated to fostering a love for language and enhancing linguistic abilities in young minds.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
              At Orchid Spell Bee, we believe that the path to mastery is as important as the destination. Our competition emphasizes the learning process, where each participant embarks on a journey of self-improvement and personal growth.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Why Orchid Spell Bee ↓
              </button>
              {isRegistrationActive && (
                student ? (
                  <button 
                    className="btn" 
                    style={{ borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Login to register
                  </button>
                ) : (
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <button 
                      className="btn" 
                      style={{ borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Login to Register
                    </button>
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="about-images reveal-right" style={{ flex: 1, display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <div className="about-img-large hover-lift" style={{ 
              background: 'url("/img/7.jpeg") center/cover', 
              height: '300px', 
              borderRadius: '12px', 
              gridRow: 'span 2',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}></div>
            <div className="about-img-small hover-lift" style={{ 
              background: 'url("/img/8.jpeg") center/cover', 
              height: '140px', 
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}></div>
            <div className="about-img-small hover-lift" style={{ 
              background: 'url("/img/9.jpeg") center/cover', 
              height: '140px', 
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}></div>
          </div>
        </div>
      </div>

      {/* Why Orchid Spell Bee Section */}
      <div id="why-us" style={{ background: '#f8f9fa', padding: '6rem 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'rgba(255,184,0,0.1)', color: 'var(--color-accent-orange-hover)', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Core Values
            </div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-heading)', margin: 0 }}>Why Orchid Spell Bee?</h2>
          </div>
          
          <div className="values-tree-container" style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', padding: '4rem 0' }}>
            
            {/* Literal SVG Tree Background */}
            <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              zIndex: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7
            }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
                 {/* Tree Base / Roots */}
                 <path d="M480 600 C 490 550, 495 500, 500 450 C 505 500, 510 550, 520 600" fill="rgba(255,184,0,0.15)" />
                 
                 {/* Main Trunk */}
                 <path d="M500 600 Q 500 350 500 150" stroke="var(--color-accent-orange)" strokeWidth="8" strokeLinecap="round" />
                 
                 {/* Top Left Branch */}
                 <path d="M500 280 Q 350 230 250 150" stroke="var(--color-accent-orange)" strokeWidth="6" strokeLinecap="round" />
                 <circle cx="250" cy="150" r="14" fill="var(--color-accent-orange)" />
                 <circle cx="230" cy="130" r="24" fill="rgba(255,184,0,0.2)" />
                 <circle cx="270" cy="120" r="10" fill="rgba(255,184,0,0.3)" />
                 
                 {/* Top Right Branch */}
                 <path d="M500 320 Q 650 260 750 180" stroke="var(--color-accent-orange)" strokeWidth="6" strokeLinecap="round" />
                 <circle cx="750" cy="180" r="14" fill="var(--color-accent-orange)" />
                 <circle cx="770" cy="160" r="24" fill="rgba(255,184,0,0.2)" />
                 <circle cx="720" cy="150" r="10" fill="rgba(255,184,0,0.3)" />
                 
                 {/* Bottom Left Branch */}
                 <path d="M500 450 Q 350 420 250 500" stroke="var(--color-accent-orange)" strokeWidth="6" strokeLinecap="round" />
                 <circle cx="250" cy="500" r="14" fill="var(--color-accent-orange)" />
                 <circle cx="230" cy="520" r="24" fill="rgba(255,184,0,0.2)" />
                 <circle cx="280" cy="530" r="10" fill="rgba(255,184,0,0.3)" />
                 
                 {/* Bottom Right Branch */}
                 <path d="M500 480 Q 650 450 750 520" stroke="var(--color-accent-orange)" strokeWidth="6" strokeLinecap="round" />
                 <circle cx="750" cy="520" r="14" fill="var(--color-accent-orange)" />
                 <circle cx="770" cy="540" r="24" fill="rgba(255,184,0,0.2)" />
                 <circle cx="730" cy="550" r="10" fill="rgba(255,184,0,0.3)" />
              </svg>
            </div>
            
            {/* Grid Layout over the Tree */}
            <div className="values-grid-inner" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem 150px',
              position: 'relative',
              zIndex: 1,
              padding: '0 1rem'
            }}>
              
              {/* Card 1 (Top Left) */}
              <div className="card reveal-up" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem', borderRadius: '20px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,184,0,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', alignSelf: 'start', marginTop: '2rem' }}>
                <h3 style={{ margin: 0, marginBottom: '0.8rem', color: 'var(--color-text-heading)', fontSize: '1.3rem', fontWeight: '800' }}>Celebration of Language</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>The competition isn't just about spelling words correctly. It's a celebration of the English language's richness and complexity.</p>
              </div>
              
              {/* Card 2 (Top Right) */}
              <div className="card reveal-up" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem', borderRadius: '20px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,184,0,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', alignSelf: 'start', marginTop: '6rem' }}>
                <h3 style={{ margin: 0, marginBottom: '0.8rem', color: 'var(--color-text-heading)', fontSize: '1.3rem', fontWeight: '800' }}>Linguistic Prowess</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>The art of spelling demonstrates a high level of linguistic skill. Competitors showcase their command of the language.</p>
              </div>
              
              {/* Card 3 (Bottom Left) */}
              <div className="card reveal-up" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem', borderRadius: '20px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,184,0,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', alignSelf: 'end', marginBottom: '6rem' }}>
                <h3 style={{ margin: 0, marginBottom: '0.8rem', color: 'var(--color-text-heading)', fontSize: '1.3rem', fontWeight: '800' }}>Learning Journey</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>The competition is more about the learning process than merely winning. Participants embark on a journey of self improvement.</p>
              </div>
              
              {/* Card 4 (Bottom Right) */}
              <div className="card reveal-up" style={{ background: 'rgba(255,255,255,0.85)', padding: '2rem', borderRadius: '20px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,184,0,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', alignSelf: 'end', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, marginBottom: '0.8rem', color: 'var(--color-text-heading)', fontSize: '1.3rem', fontWeight: '800' }}>Joy of Achievement</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>The competition instills a sense of accomplishment. Whether they win or not, participants experience the joy of achieving goals.</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Competitions & Awards Section */}
      <div style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-heading)', margin: 0, marginBottom: '1rem', fontWeight: '800' }}>Competitions & Awards</h2>
            <div style={{ width: '80px', height: '3px', background: 'var(--color-accent-orange)', margin: '0 auto' }}></div>
          </div>
          
          <div className="awards-inner" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
            {/* Left Content (Sticky) */}
            <div className="reveal-left" style={{ paddingRight: '2rem', position: 'sticky', top: '120px' }}>
              <div style={{ color: '#a0aec0', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '1rem' }}>PRIZES AND RECOGNITIONS</div>
              <h3 style={{ fontSize: '2.2rem', color: '#1a202c', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}>
                Rounds and Prizes
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a202c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
              </h3>
              <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                The competition offers students a platform to enhance their spelling skills and showcase their talents at various levels, ranging from school to national. We believe in nurturing not only their spelling capabilities but also their confidence and presentation skills. With each tier of the competition, students will have the opportunity to demonstrate their knowledge, poise, and ability to perform under pressure. Our goal is to provide a holistic learning experience that prepares participants to excel both in academics and beyond.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/rounds-and-prizes" style={{ textDecoration: 'none' }}>
                  <button className="btn btn-outline" style={{ borderRadius: '6px', padding: '0.7rem 1.8rem', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}>Check the Prizes →</button>
                </Link>
                {isRegistrationActive && (
                  student ? (
                    <button 
                      className="btn" 
                      style={{ borderRadius: '6px', padding: '0.7rem 1.8rem', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Login to register
                    </button>
                  ) : (
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                      <button 
                        className="btn" 
                        style={{ borderRadius: '6px', padding: '0.7rem 1.8rem', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}
                      >
                        Login to Register
                      </button>
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Right Cards Overlay Stack */}
            <div style={{ width: '100%' }}>
              <PrizeScrollSection />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ padding: '6rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-heading)', margin: 0, marginBottom: '1rem', fontWeight: '800' }}>Frequently Asked Questions</h2>
            <div style={{ width: '80px', height: '1px', background: '#cbd5e0', margin: '0 auto 1.5rem auto' }}></div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Get quick answers to common questions—clear, concise, and always helpful!</p>
          </div>
          
          <div className="faq-inner" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
            {[
              {
                q: "What is a spelling bee competition?",
                a: "A spelling bee is a competition in which participants are asked to spell words aloud. The words increase in difficulty as the competition progresses. Participants are eliminated if they spell a word incorrectly."
              },
              {
                q: "What happens during the competition?",
                a: "Contestants will be called up one by one to spell words. Each contestant has a set amount of time to spell their word. If they spell it correctly, they move on to the next round; if they spell it incorrectly, they are eliminated from the competition."
              },
              {
                q: "Who can participate in the competition?",
                a: "The competition is typically open to students of specific age groups or grade levels, depending on the event's rules. Some competitions are also open to adults or have categories for different skill levels."
              },
              {
                q: "Are there any practice materials available?",
                a: "Yes! Most spelling bee competitions provide a list of practice words or word lists. There may also be study guides or apps available to help participants prepare."
              },
              {
                q: "How do I register for the competition?",
                a: "Registration details are usually provided through the event's official website or by your school/organization. You may need to fill out an online form or submit a registration fee."
              },
              {
                q: "Can I ask for the definition of a word?",
                a: "Yes, contestants can typically ask for the definition, origin, or part of speech of a word to help them spell it correctly. Check the event's rules for specific details on what questions you can ask."
              }
            ].map((item, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={i} className="card reveal-up" style={{ background: 'white', padding: '1.5rem 2rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                  <div 
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h4 style={{ margin: 0, color: 'var(--color-accent-orange)', fontSize: '0.95rem', fontWeight: '500' }}>{item.q}</h4>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: '1rem', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  {isOpen && (
                    <p style={{ margin: 0, color: '#718096', fontSize: '0.85rem', lineHeight: '1.6' }}>{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popup Detail Collection Portal (Modal) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
            >
              &times;
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Student Dashboard</h2>
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              {student ? `Welcome back, ${student.name}` : "Please log in to register."}
            </p>
            
            {/* Dynamic Form Placeholder */}
          {submitSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h3 style={{ color: 'var(--color-accent-orange)' }}>Success!</h3>
              <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Your registration has been received successfully.</p>
              <button className="btn" style={{ marginTop: '2rem' }} onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          ) : formStatus === 'awaiting_or_failed' || formStatus === 'completed' || formStatus === 'error' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: formStatus === 'completed' ? '#d4edda' : '#fff3cd', color: formStatus === 'completed' ? '#155724' : '#856404', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <h3 style={{ color: 'var(--color-text-heading)', marginBottom: '1rem' }}>Status Update</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>{statusMessage}</p>
              
              {student && student.has_submission && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Your Latest Exam</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Level:</span>
                    <span style={{ fontWeight: 600 }}>{student.latest_tier}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Marks:</span>
                    <span style={{ fontWeight: 600 }}>{student.marks !== null ? student.marks : 'Awaiting Grading'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Result:</span>
                    <span style={{ fontWeight: 600, color: student.is_passed === true ? '#38a169' : student.is_passed === false ? '#e53e3e' : '#d69e2e' }}>
                      {student.is_passed === true ? 'Passed' : student.is_passed === false ? 'Failed' : 'Pending'}
                    </span>
                  </div>
                </div>
              )}

              <button className="btn" style={{ marginTop: '2rem' }} onClick={() => setIsModalOpen(false)}>Close Dashboard</button>
            </div>
          ) : activeForm ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>

              {activeForm.fields.map((field: any) => {
                if (field.depends_on && field.depends_on_value) {
                  const parentField = activeForm.fields.find((f: any) => f.label === field.depends_on);
                  if (!parentField || formData[parentField.id] !== field.depends_on_value) {
                    return null;
                  }
                }
                return (
                  <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--color-text-heading)', fontWeight: 600 }}>{field.label}</label>
                  {field.field_type === 'select' ? (
                    <select 
                      required={field.required}
                      value={formData[field.id]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: '#f8f9fa', color: '#000', outline: 'none' }}
                    >
                      <option value="">Select...</option>
                      {field.options.split(',').map((opt: string) => (
                        <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type={field.field_type === 'number' ? 'number' : field.field_type === 'email' ? 'email' : 'text'}
                      required={field.required}
                      placeholder={field.label}
                      value={formData[field.id]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: '#f8f9fa', color: '#000', outline: 'none' }}
                    />
                  )}
                </div>
                );
              })}
              
              {Number(activeForm.entry_fee) > 0 ? (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fbd38d', borderRadius: '8px', color: '#975a16' }}>
                  <strong>{activeForm.name} Entry Fee:</strong> ₹{activeForm.entry_fee}
                </div>
              ) : (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#e6fffa', border: '1px solid #b2f5ea', borderRadius: '8px', color: '#285e61' }}>
                  <strong>{activeForm.name}:</strong> Free Registration
                </div>
              )}

              <button className="btn" style={{ width: '100%', marginTop: '1rem' }} type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? 'Processing...' 
                  : Number(activeForm.entry_fee) > 0 
                    ? 'Proceed to Payment (Razorpay)' 
                    : 'Submit Registration'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-secondary)' }}>Loading form...</div>
          )}
          </div>
        </div>
      )}

    </div>
  );
}
