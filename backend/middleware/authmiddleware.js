import jwt from "jsonwebtoken";
import User from "../models/model.user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.BearerToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log(req.cookies);
    console.log(req.token);
    console.log("Incoming token:", token);

    // 🚨 STOP HERE IF TOKEN IS MISSING
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    // 🚨 Extra protection
    if (token === "null" || token === "undefined") {
      return res.status(401).json({
        message: "Invalid token format."
      });
    }

    // ✅ Verify token safely
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Invalid token structure."
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }

    req.user = user;
    req.role = decoded.role;

    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

export default authMiddleware;