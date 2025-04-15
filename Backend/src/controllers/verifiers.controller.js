const verifierService = require("../services/verifiers.service")

// Controller lấy thông tin Verifier
const getVerifierProfileController = async (req, res) => {
  try {
    const { sub } = req.user; // verifier_id từ JWT
    const verifier = await verifierService.getVerifierProfile(sub);
    res.status(200).json({
      message: "Verifier profile retrieved successfully",
      data: { ...verifier.toObject(), role: "VERIFIER" },
    });
  } catch (error) {
    res.status(error.message === "Verifier not found" ? 404 : 500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

module.exports = {
  getVerifierProfileController,
};