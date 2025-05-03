const Holder = require("../models/holders.model");
const submitted_proof = require("../models/submitted_proof");
const Verifier = require("../models/verifiers.model");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { ObjectId } = require("mongodb");

// const verificationABI = [
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "_registryDID",
//         type: "address",
//       },
//       {
//         internalType: "address",
//         name: "_verifier",
//         type: "address",
//       },
//     ],
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     inputs: [
//       {
//         internalType: "string",
//         name: "issuerDID",
//         type: "string",
//       },
//       {
//         internalType: "bytes",
//         name: "proofs",
//         type: "bytes",
//       },
//       {
//         internalType: "bytes32",
//         name: "major",
//         type: "bytes32",
//       },
//     ],
//     name: "verifyOnEd25519",
//     outputs: [
//       {
//         internalType: "bool",
//         name: "result",
//         type: "bool",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const contract = new ethers.Contract(
//   process.env.VERIFICATIONCENTER_ADDRESS,
//   verificationABI,
//   wallet
// );

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

const getAllSummittedProofs = async (verifier_did) => {
  const submitted_proofs = await submitted_proof
    .find({
      verifier_did: verifier_did,
    })
    .sort({ created_at: -1 });

  const enriched_proofs = await Promise.all(
    submitted_proofs.map(async (proof) => {
      const holder = await Holder.findOne({ DID: proof.holder_did });

      return {
        ...proof.toObject(),
        holder_name: holder ? holder.name : "Không rõ",
      };
    })
  );

  return enriched_proofs;
};

const updateProofVerificationStatus = async (
  proofId,
  isVerified,
  issuerName,
  issuerSymbol
) => {
  try {
    const proof = await submitted_proof.findById(proofId);

    if (!proof) {
      throw new Error("Không tìm thấy proof với ID đã cung cấp");
    }

    proof.is_verified = isVerified;
    proof.issuer_name = issuerName;
    proof.issuer_symbol = issuerSymbol;
    proof.updated_at = new Date();

    await proof.save();

    return {
      success: true,
      message: `Cập nhật trạng thái xác minh thành ${
        isVerified ? "đã xác minh" : "chưa xác minh"
      }`,
      data: proof,
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái xác minh:", error);
    return {
      success: false,
      message:
        error.message || "Có lỗi xảy ra khi cập nhật trạng thái xác minh",
    };
  }
};

module.exports = {
  getVerifierProfile,
  checkVerifier,
  getAllSummittedProofs,
  // verifyProof,
  updateProofVerificationStatus,
};
