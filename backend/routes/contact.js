import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'deepakvashisth2103@gmail.com',
      subject: 'New Contact Form Submission',
      text: `From: ${name} <${email}>\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

export default router;
