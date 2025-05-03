const verifierService = require("../services/verifiers.service");

// Controller lấy thông tin Verifier
const getVerifierProfileController = async (req, res) => {
  try {
    const { sub } = req.user;
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
    const { verifier_did } = req.params;
    const verifier = await verifierService.checkVerifier(verifier_did);

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

const getAllSummittedProofsController = async (req, res) => {
  try {
    const { sub } = req.user;
    const verifier = await verifierService.getVerifierProfile(sub);
    const verifier_did = verifier.DID;

    if (!verifier_did) {
      return res.status(400).json({ message: "issuer_did là bắt buộc" });
    }
    const submitted_proofs = await verifierService.getAllSummittedProofs(
      verifier_did
    );

    res.status(200).json({
      status: "SUCCESS",
      data: submitted_proofs,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const updateProofVerificationStatusController = async (req, res) => {
  try {
    const { proofId, isVerified, issuerName, issuerSymbol } = req.body;

    const result = await verifierService.updateProofVerificationStatus(
      proofId,
      isVerified,
      issuerName,
      issuerSymbol
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update proof verification status",
      message: err.message,
    });
  }
};

module.exports = {
  getVerifierProfileController,
  checkVerifierController,
  getAllSummittedProofsController,
  updateProofVerificationStatusController,
};
