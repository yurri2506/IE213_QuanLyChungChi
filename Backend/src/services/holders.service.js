const Holder = require("../models/holders.model");
const Degree = require("../models/degrees.model");
const Verifier = require("../models/verifiers.model");

// Lấy thông tin Holder
const getHolderProfile = async (holder_id) => {
  const holder = await Holder.findOne({ holder_id }).select(
    "-hashed_password -encrypted_private_key"
  );
  if (!holder) {
    throw new Error("Holder not found");
  }
  return holder;
};

/**
 * Lấy danh sách các văn bằng của holder (từ các nhà phát hành)
 */
const getDegreesByHolder = async (holder_did) => {
  const degrees = await Degree.find({ holder_did });
  return degrees;
};

/**
 * Gửi ZKP + tuyên bố đến verifier
 */
// const sendProofToVerifier = async (
//   verifier_did,
//   { proof, statement, holder_did }
// ) => {
//   const verifier = await Verifier.findOne({ verifier_did });
//   if (!verifier) throw new Error("Verifier not found");

//   // Giả định lưu dữ liệu proof gửi đi vào database (tuỳ mục đích thực tế có thể khác)
//   verifier.received_proofs = verifier.received_proofs || [];
//   verifier.received_proofs.push({
//     holder_did,
//     statement,
//     proof,
//     received_at: new Date(),
//   });
//   await verifier.save();

//   return {
//     success: true,
//     message: "Proof sent to verifier successfully",
//   };
// };

module.exports = {
  getHolderProfile,
  getDegreesByHolder,
  //sendProofToVerifier,
};
