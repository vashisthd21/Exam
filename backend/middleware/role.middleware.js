const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // User should already be attached by authMiddleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      // Check if role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Role verification failed.",
      });
    }
  };
};

export default roleMiddleware;