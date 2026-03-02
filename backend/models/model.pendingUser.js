import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String,
  otpExpire: Date,
  otpRequestCount: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now, expires: 900 } 
  
});

export default mongoose.model("PendingUser", pendingUserSchema);