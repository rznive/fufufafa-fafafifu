const jwt = require("jsonwebtoken");
const Response = require("./responseHandler");

module.exports = {
  verifyToken(req, res, next) {
    try {
      const header = req.headers.authorization;

      if (!header || !header.startsWith("Bearer ")) {
        return Response.error(res, "Unauthorized", 401);
      }

      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
    } catch (err) {
      return Response.error(res, "Invalid or expired token", 401);
    }
  },

  adminOnly(req, res, next) {
    if (req.user.role !== "admin") {
      return Response.error(res, "Forbidden: Admin only", 403);
    }
    next();
  },

  userOnly(req, res, next) {
    if (req.user.role !== "user") {
      return Response.error(res, "Forbidden: User only", 403);
    }
    next();
  },

  activeUserOnly(req, res, next) {
    if (!req.user.is_active) {
      return Response.error(res, "Your account is not active", 403);
    }
    next();
  },
};
