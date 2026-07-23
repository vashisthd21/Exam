import User from "../models/model.user.js";
import Exam from "../models/model.exam.js";
import ExamAttempt from "../models/model.examAttempt.js";

/**
 * Dashboard Analytics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalExams,
      publishedExams,
      totalAttempts,
      users,
      exams,
      attempts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ role: "admin" }),

      Exam.countDocuments(),

      Exam.countDocuments({
        isPublished: true,
      }),

      ExamAttempt.countDocuments(),

      User.find()
        .select("name email role totalScore quizScore createdAt"),

      Exam.find()
        .select("title createdAt startTime endTime"),

      ExamAttempt.find()
        .populate("student", "name")
        .populate("exam", "title")
        .sort({ createdAt: -1 }),
    ]);

    // -------------------------
    // Average Score
    // -------------------------

    const averageScore =
      attempts.length === 0
        ? 0
        : (
            attempts.reduce((sum, a) => sum + a.score, 0) /
            attempts.length
          ).toFixed(2);

    // -------------------------
    // Highest Score
    // -------------------------

    const highestScore =
      attempts.length === 0
        ? 0
        : Math.max(...attempts.map((a) => a.score));

    // -------------------------
    // Today's submissions
    // -------------------------

    const submissionsToday = attempts.filter(
      (a) => new Date(a.createdAt) >= today
    ).length;

    // -------------------------
    // Active Exams
    // -------------------------

    const now = new Date();

    const activeExams = exams.filter(
      (e) =>
        e.startTime &&
        e.endTime &&
        new Date(e.startTime) <= now &&
        new Date(e.endTime) >= now
    ).length;

    // -------------------------
    // Daily Submission Trend
    // -------------------------

    const submissionMap = {};

    attempts.forEach((attempt) => {
      const day = new Date(attempt.createdAt)
        .toISOString()
        .split("T")[0];

      submissionMap[day] =
        (submissionMap[day] || 0) + 1;
    });

    const dailySubmissions = Object.entries(submissionMap).map(
      ([date, count]) => ({
        date,
        count,
      })
    );

    // -------------------------
    // Top Students
    // -------------------------

    const topStudents = [...users]
      .filter((u) => u.role === "student")
      .sort(
        (a, b) =>
          (b.quizScore || 0) -
          (a.quizScore || 0)
      )
      .slice(0, 5);

    // -------------------------
    // Recent Activity
    // -------------------------

    const recentActivities = attempts
      .slice(0, 10)
      .map((a) => ({
        student: a.student?.name || "Unknown",
        exam: a.exam?.title || "Exam",
        score: a.score,
        submittedAt: a.createdAt,
      }));

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,

      totalExams,
      publishedExams,
      activeExams,

      totalAttempts,
      submissionsToday,

      averageScore,
      highestScore,

      dailySubmissions,

      topStudents,

      recentActivities,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load dashboard",
      error: err.message,
    });
  }
};

/**
 * User Management
 */
export const getAllUsersWithStats = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpire")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};
/**
 * Exam Management (Admin View)
 */
// In your backend controller (e.g., admin.controller.js)

export const getAllExamsAdmin = async (req, res) => {
  try {
    // .populate("teacher", "name") replaces the ObjectId with the actual User object
    const exams = await Exam.find()
      .populate("teacher", "name email") 
      .sort({ createdAt: -1 });

    res.status(200).json(exams);
  } catch (err) {
    console.error("Failed to fetch exams:", err);
    res.status(500).json({ message: "Failed to fetch exams", error: err.message });
  }
};