import User from '../models/model.user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import sendEmail from "../utils/sendEmail.js";
import PendingUser from "../models/model.pendingUser.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '4h' }
  );
};

const hashOTP = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists."
      });
    }

    console.log("Starting registration process");

    const existingPending = await PendingUser.findOne({ email });

    // ==============================
    // RESEND OTP IF PENDING EXISTS
    // ==============================
    if (existingPending) {

      if (existingPending.otpRequestCount >= 5) {
        return res.status(429).json({
          message:
            "Too many OTP requests. Please wait before trying again."
        });
      }

      const otp = generateOTP();

      existingPending.otp = hashOTP(otp);
      existingPending.otpExpire = Date.now() + 10 * 60 * 1000;
      existingPending.otpRequestCount += 1;

      await existingPending.save();

      await sendEmail(
        email,
        "ExamSecure Verification Code",
        `
        <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px;">
          <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

            <h2 style="color:#2563eb;">ExamSecure Verification</h2>

            <p style="font-size:15px; color:#555;">
              Hello <b>${existingPending.name}</b>,
            </p>

            <p style="font-size:15px; color:#555;">
              Your verification code is:
            </p>

            <div style="font-size:34px; font-weight:bold; letter-spacing:6px; color:#2563eb; margin:25px 0;">
              ${otp}
            </div>

            <p style="font-size:14px; color:#555;">
              This OTP will expire in <b>10 minutes</b>.
            </p>

            <p style="font-size:13px; color:#888;">
              If you did not request this verification code, please ignore this email.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

            <p style="font-size:12px; color:#999;">
              © ${new Date().getFullYear()} ExamSecure
            </p>

          </div>
        </div>
        `
      );

      return res.status(200).json({
        requireOTP: true,
        userId: existingPending._id,
        type: "register"
      });
    }

    // ==============================
    // NEW USER REGISTRATION
    // ==============================
    const otp = generateOTP();

    const hashedPassword = await bcrypt.hash(password, 10);

    const pendingUser = await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp: hashOTP(otp),
      otpExpire: Date.now() + 10 * 60 * 1000,
      otpRequestCount: 1
    });

    console.log("Sending OTP email");

    await sendEmail(
      email,
      "Verify Your ExamSecure Account",
      `
      <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

          <h2 style="color:#2563eb;">Welcome to ExamSecure</h2>

          <p style="font-size:16px; color:#333;">
            Hello <b>${name}</b>,
          </p>

          <p style="font-size:15px; color:#555;">
            Thank you for registering with <b>ExamSecure</b>.  
            Please use the following One-Time Password (OTP) to verify your email.
          </p>

          <div style="font-size:34px; font-weight:bold; letter-spacing:6px; color:#2563eb; margin:25px 0;">
            ${otp}
          </div>

          <p style="font-size:14px; color:#555;">
            This verification code will expire in <b>10 minutes</b>.
          </p>

          <p style="font-size:13px; color:#888;">
            If you did not create an account on ExamSecure, please ignore this email.
          </p>

          <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

          <p style="font-size:12px; color:#999;">
            © ${new Date().getFullYear()} ExamSecure. All rights reserved.
          </p>

        </div>
      </div>
      `
    );

    res.status(200).json({
      requireOTP: true,
      userId: pendingUser._id,
      type: "register"
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message:
        "Registration failed. Please try again later."
    });
  }
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const login = async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // OTP rate limit
    if (user.otpRequestCount && user.otpRequestCount >= 5) {
      return res.status(429).json({
        message:
          "Too many OTP requests. Please wait before trying again."
      });
    }

    const otp = generateOTP();

    user.otp = hashOTP(otp);
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpRequestCount = (user.otpRequestCount || 0) + 1;

    await user.save();

    // Send professional OTP email
    await sendEmail(
      user.email,
      "ExamSecure Login Verification Code",
      `
      <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

          <h2 style="color:#2563eb;">ExamSecure Login Verification</h2>

          <p style="font-size:16px; color:#333;">
            Hello <b>${user.name}</b>,
          </p>

          <p style="font-size:15px; color:#555;">
            We received a request to log in to your <b>ExamSecure</b> account.
          </p>

          <p style="font-size:15px; color:#555;">
            Please use the following One-Time Password (OTP) to complete your login:
          </p>

          <div style="font-size:34px; font-weight:bold; letter-spacing:6px; color:#2563eb; margin:25px 0;">
            ${otp}
          </div>

          <p style="font-size:14px; color:#555;">
            This verification code will expire in <b>10 minutes</b>.
          </p>

          <p style="font-size:13px; color:#888;">
            If you did not attempt to log in to ExamSecure, please ignore this email or contact support.
          </p>

          <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

          <p style="font-size:12px; color:#999;">
            © ${new Date().getFullYear()} ExamSecure. All rights reserved.
          </p>

        </div>
      </div>
      `
    );

    return res.status(200).json({
      message: "OTP sent successfully.",
      requireOTP: true,
      userId: user._id,
      remember
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed. Please try again later."
    });
  }
};

const verifyOTP = async (req, res) => {
  const { userId, otp, remember } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (
      user.otp !== hashOTP(otp) ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP data
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpRequestCount = 0;
    await user.save();

    const token = generateToken(user);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: remember
        ? 7 * 24 * 60 * 60 * 1000
        : 4 * 60 * 60 * 1000
    };
    console.log(token);
    return res
    .cookie("BearerToken", token, options)
    .status(200)
    .json({
      message: "Login successful",
      token,   // 🔥 ADD THIS
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};
const resendLoginOTP = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "Invalid request. User not found."
      });
    }

    // Rate limit (max 5 OTP requests)
    if (user.otpRequestCount && user.otpRequestCount >= 5) {
      return res.status(429).json({
        message:
          "Too many OTP requests. Please wait before requesting again."
      });
    }

    const otp = generateOTP();

    user.otp = hashOTP(otp);
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpRequestCount = (user.otpRequestCount || 0) + 1;

    await user.save();

    await sendEmail(
      user.email,
      "ExamSecure Login Verification Code",
      `
      <div style="font-family: Arial, sans-serif; background:#f4f6fb; padding:30px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

          <h2 style="color:#2563eb;">ExamSecure Login Verification</h2>

          <p style="font-size:16px; color:#333;">
            Hello <b>${user.name}</b>,
          </p>

          <p style="font-size:15px; color:#555;">
            Here is your new One-Time Password (OTP) to continue logging in to your 
            <b>ExamSecure</b> account.
          </p>

          <div style="font-size:34px; font-weight:bold; letter-spacing:6px; color:#2563eb; margin:25px 0;">
            ${otp}
          </div>

          <p style="font-size:14px; color:#555;">
            This verification code will expire in <b>10 minutes</b>.
          </p>

          <p style="font-size:13px; color:#888;">
            If you did not request this code, please ignore this email or contact support immediately.
          </p>

          <hr style="margin:25px 0; border:none; border-top:1px solid #eee;">

          <p style="font-size:12px; color:#999;">
            © ${new Date().getFullYear()} ExamSecure. All rights reserved.
          </p>

        </div>
      </div>
      `
    );

    res.status(200).json({
      message: "A new OTP has been sent to your email."
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);

    res.status(500).json({
      message: "Failed to resend OTP. Please try again later."
    });
  }
};
const verifyRegisterOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser)
      return res.status(400).json({ message: "Invalid request" });

    if (
      pendingUser.otp !== hashOTP(otp) ||
      pendingUser.otpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password
    });

    await PendingUser.findByIdAndDelete(userId);

    const token = generateToken(user);

    res.cookie("BearerToken", token, {
      httpOnly: true,
      sameSite: "Lax"
    }).json({
      message: "Registration successful",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  console.log("Reset Token:", resetToken); // Replace with email

  res.status(200).json({ message: 'Reset link sent' });
};

const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};

// =======================
// 🔥 GOOGLE AUTH (NEW)
// =======================
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google email not found" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        authProvider: "google",
        role: "user",
        totalScore: 0,
        quizSubmitted: false,
        quizScore: 0,
      });
    }

    const jwtToken = generateToken(user);

    console.log("Google Login → Role:", user.role);

    res.cookie("BearerToken", jwtToken, {
      httpOnly: true,
      secure: false,      // IMPORTANT for localhost
      sameSite: "Lax",   // REQUIRED for cross-origin
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
};

export {
  register,
  login,
  googleAuth,
  verifyOTP,
  forgotPassword,
  resetPassword,
  verifyRegisterOTP,
  resendLoginOTP,
};
