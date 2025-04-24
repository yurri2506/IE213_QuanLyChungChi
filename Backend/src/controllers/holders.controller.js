const holderService = require("../services/holders.service");

// Controller lấy thông tin Holder
const getHolderProfileController = async (req, res) => {
  try {
    const { sub } = req.user; // holder_id từ JWT
    const holder = await holderService.getHolderProfile(sub);
    res.status(200).json({
      message: "Holder profile retrieved successfully",
      data: { ...holder.toObject(), role: "HOLDER" },
    });
  } catch (error) {
    res.status(error.message === "Holder not found" ? 404 : 500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

const getDegreesController = async (req, res) => {
  try {
    const { sub } = req.user;
    const holder = await holderService.getHolderProfile(sub);
    const degrees = await holderService.getDegreesByHolder(holder.DID);
    res.status(200).json({
      message: "Degrees retrieved successfully",
      data: degrees,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

const createProofController = async (req, res) => {
  try {
    const { sub } = req.user;
    const holder = await holderService.getHolderProfile(sub);
    const holder_did = holder.DID;

    const { issuer_did, degree_id } = req.body;
    const proof = await holderService.createProof(
      holder_did,
      issuer_did,
      degree_id
    );
    res.status(200).json({
      message: "Proof created successfully",
      data: proof,
    });
  } catch (error) {
    res.status(error.message === "Degree not found" ? 404 : 500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

/**
 * * Gửi ZKP + tuyên bố đến verifier
 */
const sendProofToVerifierController = async (req, res) => {
  try {
    const { verifierDID } = req.params;
    const { issuer_did, proof, major } = req.body;
    const { sub } = req.user;

    if (!proof || !major) {
      return res.status(400).json({ message: "Missing proof or statement" });
    }

    const holder = await holderService.getHolderProfile(sub);

    const result = await holderService.sendProofToVerifier({
      verifier_did: verifierDID,
      issuer_did,
      holder_did: holder.DID,
      proof,
      major,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.message === "Verifier not found" ? 404 : 500).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

module.exports = {
  getHolderProfileController,
  getDegreesController,
  createProofController,
  sendProofToVerifierController,
};
