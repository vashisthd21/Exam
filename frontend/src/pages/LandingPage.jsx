import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Contact form state for footer
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');

  const handleContactChange = (e) => {
    setContact(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.message) {
    setStatus('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setStatus('Thank you for contacting us! We will get back to you shortly.');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus(data.error || 'Something went wrong.');
    }
  } catch (err) {
    setStatus('Failed to send message.');
    console.error(err);
  }
};


  return (
    <>
      <header style={styles.header}>
        <div style={styles.navbar}>
          <h1 style={styles.logo}>Exam Secure</h1>
          <nav style={styles.navLinks}>
            <Link to="/" style={styles.navLink}>Home</Link>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/contact" style={styles.navLink}>Contact Us</Link>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.heroSection}>
          <h2 style={styles.heroTitle}>Test Your Knowledge & Ace Your UPSC Exams</h2>
          <p style={styles.heroSubtitle}>
            Exam Secure is your trusted platform for practicing UPSC exam questions with confidence.
          </p>
          <Link to="/register" style={styles.ctaButton}>Get Started</Link>
        </section>

        <section style={styles.featuresSection}>
          <h3 style={styles.featuresTitle}>Why Choose Exam Secure?</h3>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <h4>Realistic Practice</h4>
              <p>Take quizzes that simulate the actual UPSC exam environment.</p>
            </div>
            <div style={styles.featureCard}>
              <h4>Track Your Progress</h4>
              <p>Monitor your quiz scores and improve steadily over time.</p>
            </div>
            <div style={styles.featureCard}>
              <h4>Secure & Reliable</h4>
              <p>Your data and progress are safe with top-notch security.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerAbout}>
            <h3 style={{color: 'white'}}>Exam Secure</h3>
            <p>A platform for testing your knowledge and practicing for UPSC exams.</p>
          </div>

          <div style={styles.footerContact}>
            <h3 style={{color: 'white'}}>Contact Us</h3>
            <form onSubmit={handleContactSubmit} style={styles.contactForm}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contact.name}
                onChange={handleContactChange}
                style={styles.footerInput}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={contact.email}
                onChange={handleContactChange}
                style={styles.footerInput}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={contact.message}
                onChange={handleContactChange}
                style={styles.footerTextarea}
                required
              />
              <button type="submit" style={styles.footerButton}>Send</button>
              {contactStatus && <p style={styles.contactStatus}>{contactStatus}</p>}
            </form>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Exam Secure. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

const styles = {
  header: {
    backgroundColor: '#4c51bf',
    padding: '15px 40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navbar: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    cursor: 'default',
  },
  navLinks: {
    display: 'flex',
    gap: '25px',
  },
  navLink: {
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  main: {
    maxWidth: '1100px',
    margin: '50px auto 100px',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '70px',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '15px',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#4a5568',
    marginBottom: '30px',
  },
  ctaButton: {
    backgroundColor: '#4c51bf',
    color: 'white',
    padding: '14px 40px',
    fontSize: '18px',
    fontWeight: '700',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s ease',
  },
  featuresSection: {
    textAlign: 'center',
  },
  featuresTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#2d3748',
  },
  featuresGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  featureCard: {
    backgroundColor: '#edf2f7',
    padding: '25px 20px',
    borderRadius: '15px',
    width: '300px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    fontWeight: '500',
    color: '#4a5568',
  },
  footer: {
    backgroundColor: '#2d3748',
    padding: '40px 20px 20px',
  },
  footerContent: {
    maxWidth: '1100px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '50px',
    flexWrap: 'wrap',
    color: 'white',
  },
  footerAbout: {
    flex: '1 1 350px',
  },
  footerContact: {
    flex: '1 1 350px',
  },
  contactForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerInput: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  footerTextarea: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '80px',
  },
  footerButton: {
    backgroundColor: '#4c51bf',
    border: 'none',
    color: 'white',
    padding: '12px 0',
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  contactStatus: {
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#68d391',
  },
  footerBottom: {
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: '14px',
    paddingTop: '15px',
    borderTop: '1px solid #4a5568',
  },
};

export default LandingPage;
