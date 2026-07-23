import jwt from "jsonwebtoken";
import User from "../models/model.user.js";

const teacherAuth = async (req, res, next) => {
  try {
    // -------------------------------
    // Get Token
    // -------------------------------
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    // -------------------------------
    // Verify Token
    // -------------------------------
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // -------------------------------
    // Find Teacher
    // -------------------------------
    const teacher = await User.findById(decoded.id).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    // -------------------------------
    // Check Role
    // -------------------------------
    if (teacher.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Teacher only.",
      });
    }

    // -------------------------------
    // Attach Teacher
    // -------------------------------
    req.teacher = teacher;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default teacherAuth;