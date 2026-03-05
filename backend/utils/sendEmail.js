import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS handled automatically
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: "ExamSecure <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

export default sendEmail;
