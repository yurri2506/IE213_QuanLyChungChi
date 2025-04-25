const Verifier = require("../models/verifiers.model");

// Lấy thông tin Verifier
const getVerifierProfile = async (verifier_id) => {
  const verifier = await Verifier.findOne({ verifier_id }).select(
    "-hashed_password -encrypted_private_key"
  );
  if (!verifier) {
    throw new Error("Verifier not found");
  }
  return verifier;
};

const checkVerifier = async (verifier_did) => {
  const verifier = await Verifier.findOne({ DID: verifier_did });
  if (!verifier) {
    return false;
  }
  return true;
};

module.exports = {
  getVerifierProfile,
  checkVerifier,
};
