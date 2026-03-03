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
      return res.status(400).json({ message: "User already exists" });
    }

    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) {
      if (existingPending.otpRequestCount >= 5) {
        return res.status(429).json({
          message: "Too many OTP requests. Try later."
        });
      }

      const otp = generateOTP();

      existingPending.otp = hashOTP(otp);
      existingPending.otpExpire = Date.now() + 10 * 60 * 1000;
      existingPending.otpRequestCount += 1;

      await existingPending.save();

      await sendEmail(email, "Resend OTP", `<h1>${otp}</h1>`);

      return res.status(200).json({
        requireOTP: true,
        userId: existingPending._id,
        type: "register"
      });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    const pendingUser = await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp: hashOTP(otp),
      otpExpire: Date.now() + 10 * 60 * 1000
    });

    await sendEmail(
      email,
      "Verify Your Account",
      `<h1>${otp}</h1>`
    );

    res.status(200).json({
      requireOTP: true,
      userId: pendingUser._id,
      type: "register"
    });

  } catch (error) {
    res.status(500).json({ message: "Register failed" });
  }
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const login = async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔥 Rate limit OTP requests (max 5 per 15 min)
    if (user.otpRequestCount && user.otpRequestCount >= 5) {
      return res.status(429).json({
        message: "Too many OTP requests. Try again later."
      });
    }

    const otp = generateOTP();

    user.otp = hashOTP(otp);  // 🔐 hashed
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpRequestCount = (user.otpRequestCount || 0) + 1;

    await user.save();

    await sendEmail(
      user.email,
      "Your OTP for ExamSecure Login",
      `
        <h2>Hello ${user.name},</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#2563eb;">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `
    );

    return res.status(200).json({
      message: "OTP sent",
      requireOTP: true,
      userId: user._id,
      remember
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
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
      sameSite: "Lax",
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
      return res.status(400).json({ message: "Invalid request" });
    }

    // 🔥 Rate limit (max 5 per 15 minutes)
    if (user.otpRequestCount && user.otpRequestCount >= 5) {
      return res.status(429).json({
        message: "Too many OTP requests. Try again later."
      });
    }

    const otp = generateOTP();

    user.otp = hashOTP(otp);
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpRequestCount = (user.otpRequestCount || 0) + 1;

    await user.save();

    await sendEmail(
      user.email,
      "Resend OTP - ExamSecure",
      `
        <h2>Hello ${user.name},</h2>
        <p>Your new OTP is:</p>
        <h1 style="color:#2563eb;">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `
    );

    res.status(200).json({
      message: "OTP resent successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP" });
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
