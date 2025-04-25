const verifierService = require("../services/verifiers.service");

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

const checkVerifierController = async (req, res) => {
  try {
    const { verifier_did } = req.params; // Lấy verifier_did từ URL
    const verifier = await verifierService.checkVerifier(verifier_did); // Gọi service để kiểm tra Verifier

    res.status(200).json({
      status: "SUCCESS",
      data: verifier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: "ERROR",
      error: error.message,
    });
  }
};

module.exports = {
  getVerifierProfileController,
  checkVerifierController,
};
