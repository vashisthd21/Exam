import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import { adminOnly } from '../middleware/role.middleware.js';
// import { getAdminStats } from '../controllers/controller.admin.js';
import { getAllUsersWithStats } from '../controllers/controller.admin.js';
const router = express.Router();

// 🔥 Admin Dashboard Route
router.get('/dashboard', authMiddleware, adminOnly, async (req, res) => {
  try {
    res.status(200).json({
      message: 'Welcome to Admin Dashboard',
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error loading admin dashboard'
    });
  }
});
router.get("/users", authMiddleware, adminOnly, getAllUsersWithStats);
export default router;