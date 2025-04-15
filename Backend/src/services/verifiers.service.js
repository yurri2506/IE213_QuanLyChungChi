const Verifier = require("../models/verifiers.model")

// Lấy thông tin Verifier
const getVerifierProfile = async (verifier_id) => {
  const verifier = await Verifier.findOne({ verifier_id }).select("-hashed_password -encrypted_private_key");
  if (!verifier) {
    throw new Error("Verifier not found");
  }
  return verifier;
};

module.exports = {
  getVerifierProfile,
}