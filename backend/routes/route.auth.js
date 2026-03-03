
import express from 'express';
import {
  register,
  login,
  googleAuth,
  verifyOTP,
  forgotPassword,
  resetPassword,
  verifyRegisterOTP,
  resendLoginOTP,
} from '../controllers/controller.auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google', googleAuth);
router.post('/verify-register-otp', verifyRegisterOTP);
router.post("/resend-login-otp", resendLoginOTP);

export default router;
