import User from "../models/model.user.js";

export const getAllUsersWithStats = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpire")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};