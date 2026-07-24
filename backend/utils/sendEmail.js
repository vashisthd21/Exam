import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify SMTP connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verify Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("==================================");
    console.log("Sending email...");
    console.log("To:", to);
    console.log("From:", process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: `"ExamSecure - Secure Online Exam Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("==================================");
    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("==================================");

    return info;
  } catch (error) {
    console.error("==================================");
    console.error("❌ Email Sending Error");
    console.error(error);
    console.error("==================================");
    throw error;
  }
};

export default sendEmail;
