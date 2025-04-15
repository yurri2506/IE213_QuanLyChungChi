const issuerService = require("../services/issuers.service")

// Controller lấy thông tin Issuer
const getIssuerProfileController = async (req, res) => {
  try {
    const { sub } = req.user; // issuer_id từ JWT
    const issuer = await issuerService.getIssuerProfile(sub);
    res.status(200).json({
      message: "Issuer profile retrieved successfully",
      data: { ...issuer.toObject(), role: "ISSUER" },
    });
  } catch (error) {
    res.status(error.message === "Issuer not found" ? 404 : 500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

module.exports = {
  getIssuerProfileController,
};