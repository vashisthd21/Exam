import User from "../models/model.user.js";
export const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.user._id);
    console.log(user);
    console.log(user.role);
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only."
    });
  }

  next();
};