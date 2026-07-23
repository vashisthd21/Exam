import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  Send 
} from 'lucide-react';

const API = 'https://exam-86ot.onrender.com';

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
      <style>{`
        body { margin: 0; background: #F8FAFC; font-family: 'Inter', -apple-system, sans-serif; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 16px rgba(0,0,0,0.02);
          transition: all 0.25s ease;
        }
        .glass-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
          border-color: #CBD5E1;
        }

        .btn-primary { transition: all 0.2s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25); background: #1D4ED8 !important; }
        
        .btn-secondary { transition: all 0.2s ease; }
        .btn-secondary:hover { background: #F1F5F9; border-color: #CBD5E1; }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
      `}</style>

      {/* NAVBAR */}
      <header style={styles.header}>
        <div style={styles.navbar}>
          <div style={styles.logoContainer}>
            <Shield size={24} color="#2563EB" />
            <h1 style={styles.logo}>ExamSecure</h1>
          </div>
          <nav style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navButton} className="btn-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero} className="animate-fade-in">
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>
            <span style={styles.badgeDot}></span> Enterprise-Grade Proctoring & Assessment
          </div>
          <h2 style={styles.heroTitle}>Secure Online Exam Platform</h2>
          <p style={styles.heroSubtitle}>
            A distraction-free, exam-focused environment built for disciplined preparation and uncompromised integrity.
          </p>
          <div style={styles.heroActions}>
            <Link to="/register" style={styles.primaryBtn} className="btn-primary">
              Start Free Trial <ArrowRight size={16} />
            </Link>
            <Link to="/login" style={styles.secondaryBtn} className="btn-secondary">
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statCard} className="glass-card">
            <h3 style={styles.statValue}>50K+</h3>
            <p style={styles.statLabel}>Active Aspirants</p>
          </div>
          <div style={styles.statCard} className="glass-card">
            <h3 style={styles.statValue}>10K+</h3>
            <p style={styles.statLabel}>Published Tests</p>
          </div>
          <div style={styles.statCard} className="glass-card">
            <h3 style={styles.statValue}>92%</h3>
            <p style={styles.statLabel}>Success Rate</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionCategory}>Capabilities</span>
          <h3 style={styles.sectionTitle}>Why Choose ExamSecure?</h3>
          <p style={styles.sectionDesc}>Engineered with precision to replicate high-stakes professional examinations.</p>
        </div>
        <div style={styles.grid}>
          <Feature 
            icon={<FileText size={22} color="#2563EB" />} 
            title="Real Exam Environment" 
            desc="Timed testing loops with strict parameters to accurately simulate standardized testing conditions." 
          />
          <Feature 
            icon={<BarChart3 size={22} color="#10B981" />} 
            title="Advanced Analytics" 
            desc="Granular insights into question pacing, subject-wise accuracy, and historical progress." 
          />
          <Feature 
            icon={<Lock size={22} color="#8B5CF6" />} 
            title="Highly Secure" 
            desc="Robust anti-cheat mechanisms, strict tab-switch detection, and single-device session locks." 
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.altSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionCategory}>Workflow</span>
          <h3 style={styles.sectionTitle}>How It Works</h3>
          <p style={styles.sectionDesc}>Get started with your structured preparation in three seamless steps.</p>
        </div>
        <div style={styles.grid}>
          <Step num="01" title="Register Account" desc="Create your secure student or instructor profile in seconds." />
          <Step num="02" title="Attempt Assessments" desc="Take proctored practice tests under realistic exam conditions." />
          <Step num="03" title="Analyze & Improve" desc="Review detailed score reports and AI-backed diagnostic breakdowns." />
        </div>
      </section>

      {/* TRUST */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionCategory}>Security Standards</span>
          <h3 style={styles.sectionTitle}>Built for Trust & Integrity</h3>
          <p style={styles.sectionDesc}>Institutional-grade controls ensuring absolute fairness across every session.</p>
        </div>
        <div style={styles.trustGrid}>
          <TrustItem text="Secure Token-Based Authentication" />
          <TrustItem text="Single-Device Active Login Policy" />
          <TrustItem text="Real-Time Tab-Switch & Focus Detection" />
          <TrustItem text="End-to-End Encrypted Database Records" />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          {/* BRAND */}
          <div>
            <div style={styles.logoContainer}>
              <Shield size={22} color="#FFFFFF" />
              <h3 style={styles.footerLogo}>ExamSecure</h3>
            </div>
            <p style={styles.footerDesc}>
              A secure examination infrastructure built for disciplined professional preparation.
            </p>
            <p style={styles.footerTag}>Discipline • Accuracy • Integrity</p>
          </div>

          {/* LINKS */}
          <div>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/login" style={styles.footerLink}>Login Portal</Link>
            <Link to="/register" style={styles.footerLink}>Create Account</Link>
            <span style={styles.footerLink}>Privacy Policy</span>
          </div>

          {/* CONTACT CARD */}
          <form onSubmit={handleSubmit} style={styles.contactCard}>
            <h4 style={styles.footerHeading}>Get in Touch</h4>

            <input
              style={styles.input}
              className="form-input"
              name="name"
              placeholder="Your Name"
              value={contact.name}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              className="form-input"
              name="email"
              placeholder="Your Email Address"
              value={contact.email}
              onChange={handleChange}
            />

            <textarea
              style={styles.textarea}
              className="form-textarea"
              name="message"
              placeholder="How can we help you?"
              value={contact.message}
              onChange={handleChange}
            />

            <button style={styles.submitBtn} disabled={loading} className="btn-primary">
              <Send size={15} /> {loading ? 'Sending Message...' : 'Send Message'}
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

const Feature = ({ icon, title, desc }) => (
  <div style={styles.card} className="glass-card">
    <div style={styles.cardIconBox}>{icon}</div>
    <h4 style={styles.cardTitle}>{title}</h4>
    <p style={styles.cardDesc}>{desc}</p>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div style={styles.card} className="glass-card">
    <span style={styles.stepNum}>{num}</span>
    <h4 style={styles.cardTitle}>{title}</h4>
    <p style={styles.cardDesc}>{desc}</p>
  </div>
);

const TrustItem = ({ text }) => (
  <div style={styles.trustItem} className="glass-card">
    <CheckCircle2 size={18} color="#10B981" />
    <span style={styles.trustText}>{text}</span>
  </div>
);

const styles = {
  header: { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 40px', position: 'sticky', top: 0, zIndex: 50 },
  navbar: { maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { color: '#0F172A', fontWeight: 800, fontSize: 20, margin: 0, letterSpacing: '-0.02em' },
  navLinks: { display: 'flex', gap: 24, alignItems: 'center' },
  navLink: { color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: 14, transition: 'color 0.2s' },
  navButton: { background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 },

  hero: { background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)', padding: '100px 20px 120px', borderBottom: '1px solid #E2E8F0' },
  heroInner: { maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EFF6FF', color: '#2563EB', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 24, border: '1px solid #BFDBFE' },
  badgeDot: { width: 6, height: 6, borderRadius: '50%', background: '#2563EB' },
  heroTitle: { fontSize: '3rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', margin: '0 0 16px 0' },
  heroSubtitle: { color: '#64748B', fontSize: '1.15rem', lineHeight: 1.6, margin: '0 auto 36px', maxWidth: 640 },
  heroActions: { display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
  primaryBtn: { background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 },
  secondaryBtn: { background: '#FFFFFF', color: '#0F172A', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15, border: '1px solid #CBD5E1' },

  statsSection: { background: '#F8FAFC', padding: '0 20px' },
  statsContainer: { maxWidth: 1000, margin: '-50px auto 0', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', position: 'relative', zIndex: 10 },
  statCard: { background: '#fff', padding: '28px 36px', borderRadius: 16, textAlign: 'center', minWidth: 240 },
  statValue: { margin: '0 0 4px 0', fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' },
  statLabel: { margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },

  section: { padding: '90px 20px', textAlign: 'center', maxWidth: 1100, margin: '0 auto' },
  altSection: { padding: '90px 20px', background: '#F1F5F9', textAlign: 'center', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' },
  sectionHeader: { maxWidth: 650, margin: '0 auto 50px' },
  sectionCategory: { fontSize: 12, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 },
  sectionTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0', letterSpacing: '-0.02em' },
  sectionDesc: { color: '#64748B', fontSize: 15, margin: 0 },

  grid: { display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' },
  card: { background: '#fff', padding: 32, borderRadius: 18, width: 300, textAlign: 'left' },
  cardIconBox: { width: 42, height: 42, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' },
  cardDesc: { fontSize: 14, color: '#64748B', lineHeight: 1.5, margin: 0 },
  stepNum: { fontSize: 22, fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: 20 },

  trustGrid: { maxWidth: 700, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  trustItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#FFFFFF', borderRadius: 12, textAlign: 'left' },
  trustText: { fontSize: 14, fontWeight: 600, color: '#1E293B' },

  footer: { background: '#0F172A', color: '#CBD5F5', padding: '80px 40px 30px' },
  footerGrid: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 40 },

  footerLogo: { fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' },
  footerDesc: { marginTop: 12, lineHeight: 1.6, fontSize: 14, color: '#94A3B8' },
  footerTag: { marginTop: 10, fontSize: 13, color: '#64748B', fontWeight: 500 },

  footerHeading: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#fff', letterSpacing: '-0.01em' },
  footerLink: { fontSize: 14, marginBottom: 10, display: 'block', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' },

  contactCard: {
    background: '#1E293B',
    padding: 24,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    border: '1px solid #334155'
  },

  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0F172A', color: '#fff', fontSize: 14 },
  textarea: { padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0F172A', color: '#fff', fontSize: 14, minHeight: 80, resize: 'vertical' },

  submitBtn: {
    background: '#2563eb',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  status: { fontSize: 13, color: '#34D399', margin: 0, fontWeight: 500 },
  footerDivider: { height: 1, background: 'rgba(255,255,255,0.1)', margin: '40px 0 20px' },
  footerBottom: { textAlign: 'center', fontSize: 13, color: '#64748B' },
};

export default LandingPage;