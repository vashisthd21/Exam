import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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