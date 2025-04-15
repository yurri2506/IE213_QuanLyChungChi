const jwt = require("jsonwebtoken");
require("dotenv").config();

// Hàm chung để kiểm tra token và vai trò
const restrictTo = (allowedRole) => {
  return (req, res, next) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    // Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
        status: "ERROR",
      });
    }

    // Xác minh token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err.message);
        return res.status(403).json({
          message: "Invalid or expired token",
          status: "ERROR",
        });
      }

      // Kiểm tra vai trò
      if (decoded.role !== allowedRole) {
        return res.status(403).json({
          message: `Access denied: ${allowedRole} role required`,
          status: "ERROR",
        });
      }

      // Lưu thông tin user vào req để dùng ở controller
      req.user = decoded; // decoded chứa sub, role, did
      next();
    });
  };
};

// Middleware cho từng vai trò
const issuerMiddleware = restrictTo("ISSUER");
const holderMiddleware = restrictTo("HOLDER");
const verifierMiddleware = restrictTo("VERIFIER");

module.exports = {
  issuerMiddleware,
  holderMiddleware,
  verifierMiddleware,
};