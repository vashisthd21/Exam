import express from "express";
import {
  getDashboardStats,
  getAllUsersWithStats,
  getAllExamsAdmin,
} from "../controllers/controller.admin.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard",
    authMiddleware,
    getDashboardStats
);

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

router.get(
    "/users",
    authMiddleware,
    getAllUsersWithStats
);
router.get("/exams", getAllExamsAdmin);
export default router;