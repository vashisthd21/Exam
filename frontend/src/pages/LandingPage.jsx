import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL;
const LandingPage = () => {
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) {
      setStatus('Please fill all fields.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      if (res.ok) {
        setStatus('Message sent successfully.');
        setContact({ name: '', email: '', message: '' });
      } else {
        setStatus('Something went wrong.');
      }
    } catch {
      setStatus('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header style={styles.header}>
        <div style={styles.navbar}>
          <h1 style={styles.logo}>ExamSecure</h1>
          <nav style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navButton}>Get Started</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h2 style={styles.heroTitle}>Secure Online Exam Platform</h2>
          <p style={styles.heroSubtitle}>
            A distraction-free, exam-focused environment built for serious aspirants.
          </p>
          <div style={styles.heroActions}>
            <Link to="/register" style={styles.primaryBtn}>Start Free</Link>
            <Link to="/login" style={styles.secondaryBtn}>Login</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3>50K+</h3>
            <p>Students</p>
          </div>
          <div style={styles.statCard}>
            <h3>10K+</h3>
            <p>Practice Tests</p>
          </div>
          <div style={styles.statCard}>
            <h3>92%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Why Choose ExamSecure?</h3>
        <div style={styles.grid}>
          <Feature title="Real Exam Environment" desc="Timed tests with strict rules to simulate real exams." />
          <Feature title="Advanced Analytics" desc="Detailed insights into accuracy, speed, and progress." />
          <Feature title="Highly Secure" desc="Anti-cheat systems, login protection, and monitoring." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.altSection}>
        <h3 style={styles.sectionTitle}>How It Works</h3>
        <div style={styles.grid}>
          <Step num="1" title="Register" desc="Create your account in seconds." />
          <Step num="2" title="Attempt Tests" desc="Practice in exam-like conditions." />
          <Step num="3" title="Analyze & Improve" desc="Learn from performance insights." />
        </div>
      </section>

      {/* TRUST */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Built for Trust & Security</h3>
        <div style={styles.trustBox}>
          <p>✔ Secure Authentication</p>
          <p>✔ One-Device Login</p>
          <p>✔ Tab-Switch Detection</p>
          <p>✔ Encrypted Data</p>
        </div>
      </section>

{/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          {/* BRAND */}
          <div>
            <h3 style={styles.footerLogo}>ExamSecure</h3>
            <p style={styles.footerDesc}>
              A secure exam platform for disciplined preparation.
            </p>
            <p style={styles.footerTag}>Discipline • Accuracy • Integrity</p>
          </div>

          {/* LINKS */}
          <div>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            <p style={styles.footerLink}>Home</p>
            <p style={styles.footerLink}>Login</p>
            <p style={styles.footerLink}>Register</p>
            <p style={styles.footerLink}>Privacy Policy</p>
          </div>

          {/* CONTACT CARD */}
          <form onSubmit={handleSubmit} style={styles.contactCard}>
            <h4 style={styles.footerHeading}>Contact Us</h4>

            <input
              style={styles.input}
              name="name"
              placeholder="Your Name"
              value={contact.name}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="email"
              placeholder="Your Email"
              value={contact.email}
              onChange={handleChange}
            />

            <textarea
              style={styles.textarea}
              name="message"
              placeholder="Your Message"
              value={contact.message}
              onChange={handleChange}
            />

            <button style={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {status && <p style={styles.status}>{status}</p>}
          </form>
        </div>

        <div style={styles.footerDivider} />

        <p style={styles.footerBottom}>
          © {new Date().getFullYear()} ExamSecure. All rights reserved.
        </p>
      </footer>

    </>
  );
};

const Feature = ({ title, desc }) => (
  <div style={styles.card}>
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div style={styles.card}>
    <span style={styles.stepNum}>{num}</span>
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

const styles = {
  header: { background: '#0b3a82', padding: '18px 40px' },
  navbar: { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#fff', fontWeight: 800, fontSize: 26 },
  navLinks: { display: 'flex', gap: 20, alignItems: 'center' },
  navLink: { color: '#dbeafe', textDecoration: 'none', fontWeight: 600 },
  navButton: { background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 },

  hero: { background: 'linear-gradient(180deg, #0b3a82, #eaf1ff)', padding: '120px 20px' },
  heroInner: { maxWidth: 900, margin: '0 auto', textAlign: 'center' },
  heroTitle: { fontSize: '3.4rem', fontWeight: 800, color: '#fff' },
  heroSubtitle: { color: '#dbeafe', fontSize: '1.25rem', margin: '20px auto 40px', maxWidth: 700 },
  heroActions: { display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' },
  primaryBtn: { background: '#2563eb', color: '#fff', padding: '14px 36px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 },
  secondaryBtn: { background: '#fff', color: '#2563eb', padding: '14px 36px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 },

  statsSection: { background: '#fff', padding: '60px 20px' },
  statsContainer: { maxWidth: 1000, margin: '-100px auto 0', display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' },
  statCard: { background: '#fff', padding: '30px 40px', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', textAlign: 'center', minWidth: 220 },

  section: { padding: '90px 20px', textAlign: 'center' },
  altSection: { padding: '90px 20px', background: '#f1f5f9', textAlign: 'center' },
  sectionTitle: { fontSize: '2.4rem', fontWeight: 700, marginBottom: 50 },

  grid: { display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' },
  card: { background: '#fff', padding: 32, borderRadius: 16, width: 300, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' },
  stepNum: { fontSize: 28, fontWeight: 800, color: '#2563eb' },

  trustBox: { maxWidth: 600, margin: '0 auto', textAlign: 'left', lineHeight: 2, fontSize: 16 },

  footer: { background: '#0f172a', color: '#cbd5f5', padding: '80px 20px 30px' },
  footerGrid: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 40 },

  footerLogo: { fontSize: 26, fontWeight: 800, color: '#fff' },
  footerDesc: { marginTop: 12, lineHeight: 1.6 },
  footerTag: { marginTop: 10, fontSize: 14 },

  footerHeading: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#fff' },
  footerLink: { fontSize: 14, marginBottom: 8, cursor: 'pointer' },

  contactCard: {
    background: '#020617',
    padding: 24,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  input: { padding: 10, borderRadius: 8, border: 'none' },
  textarea: { padding: 10, borderRadius: 8, border: 'none', minHeight: 80 },

  submitBtn: {
    background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer',
  },

  status: { fontSize: 13, color: '#a7f3d0' },
  footerDivider: { height: 1, background: 'rgba(255,255,255,0.1)', margin: '40px 0 20px' },
  footerBottom: { textAlign: 'center', fontSize: 14, color: '#94a3b8' },

};

export default LandingPage;
