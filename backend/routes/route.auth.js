// import express from 'express';
// import jwt from 'jsonwebtoken';
// import { OAuth2Client } from 'google-auth-library';

// const router = express.Router();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // 🔹 NORMAL LOGIN
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // TODO: Replace with DB logic
//   if (email === 'admin@test.com' && password === '123456') {
//     const token = jwt.sign(
//       { email },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     return res.json({
//       token,
//       user: { email }
//     });
//   }

//   res.status(401).json({ message: 'Invalid credentials' });
// });

// // 🔹 GOOGLE LOGIN
// router.post('/google', async (req, res) => {
//   try {
//     const { token } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();

//     // 🔐 Optional: restrict to college emails
//     // if (!payload.email.endsWith('@college.edu')) {
//     //   return res.status(403).json({ message: 'Unauthorized email' });
//     // }

//     const user = {
//       name: payload.name,
//       email: payload.email
//     };

//     const jwtToken = jwt.sign(
//       user,
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     res.json({ token: jwtToken, user });

//   } catch (err) {
//     res.status(401).json({ message: 'Google authentication failed' });
//   }
// });

// export default router;

import express from 'express';
import { register, login, googleAuth } from '../controllers/controller.auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth); // 🔥 NEW

export default router;
