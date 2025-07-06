import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
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
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Contact Us</h2>
        <p style={styles.description}>
          Have questions or feedback? Fill out the form below and we'll get back to you soon.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            style={styles.textarea}
            required
          />

          {status && <p style={styles.status}>{status}</p>}

          <button type="submit" style={styles.button}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: 'white',
    padding: '40px 30px',
    maxWidth: '450px',
    width: '100%',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
  },
  heading: {
    fontWeight: '700',
    fontSize: '28px',
    color: '#333',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '12px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    outline: 'none',
    minHeight: '100px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '14px',
    backgroundColor: '#5a67d8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontFamily: 'inherit',
  },
  status: {
    color: '#2d3748',
    fontWeight: '600',
    fontSize: '14px',
  },
};

export default ContactUs;
