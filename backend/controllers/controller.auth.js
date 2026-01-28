import User from '../models/model.user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 JWT generator
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

// =======================
// NORMAL REGISTER
// =======================
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      totalScore: 0,
      quizSubmitted: false,
      quizScore: 0,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 86400000,
    };

    return res
      .cookie('BearerToken', token, options)
      .status(200)
      .json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        message: 'Register successful',
      });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// =======================
// NORMAL LOGIN
// =======================
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000,
    };

    return res
      .cookie('BearerToken', token, options)
      .status(200)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        message: 'Login successful',
      });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

// =======================
// 🔥 GOOGLE AUTH (NEW)
// =======================
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Google email not found' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist → create
    if (!user) {
      user = await User.create({
        name,
        email,
        password: null, // 🔥 Google users don't need password
        totalScore: 0,
        quizSubmitted: false,
        quizScore: 0,
      });
    }

    const jwtToken = generateToken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 86400000,
    };
    console.log(user);
    return res
      .cookie('BearerToken', jwtToken, options)
      .status(200)
      .json({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        message: 'Google authentication successful',
      });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

export {
  register,
  login,
  googleAuth, // ✅ EXPORT THIS
};
