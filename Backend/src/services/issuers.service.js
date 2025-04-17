const Issuer = require("../models/issuers.model");
const Degree = require("../models/degrees.model");
const { ethers } = require("ethers");
require("dotenv").config();

const contractABI = [
  "function registerIssuer(string did, tuple(bool isRegistered, bytes pubKey, string signatureAlgorithm, string name, string symbol) issuerInfo) external",
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.REGISTRYDID_ADDRESS,
  contractABI,
  wallet
);

// Lấy thông tin Issuer
const getIssuerProfile = async (issuer_id) => {
  const issuer = await Issuer.findOne({ issuer_id }).select(
    "-hashed_password -encrypted_private_key"
  );
  if (!issuer) {
    throw new Error("Issuer not found");
  }
  return issuer;
};

// Tạo chứng chỉ xác nhận
const createDegree = async (data) => {
  const {
    holder_did,
    issuer_did,
    major,
    faculty,
    time_of_training,
    mode_of_study,
    year_graduation,
    classification,
    serial_number,
    reference_number,
    date_of_issue,
    signature,
  } = data;
  const existDegree = await Degree.findOne({
    holder_did: holder_did,
    issuer_did: issuer_did,
  });
  if (existDegree) throw new Error("Degree already exists!");

  const degree = new Degree({
    holder_did,
    issuer_did,
    major,
    faculty,
    time_of_training,
    mode_of_study,
    year_graduation,
    classification,
    serial_number,
    reference_number,
    date_of_issue,
    signature,
    created_at: new Date(),
    updated_at: new Date(),
  });

  await degree.save();
  return degree.id;
};

const registerDID = async (data) => {
  const { issuer_did, public_key, name, symbol } = data;

  try {
    if (!issuer_did || !public_key || !name || !symbol) {
      throw new Error("Thiếu thông tin bắt buộc để đăng ký DID.");
    }

    const issuerInfo = {
      isRegistered: true,
      pubKey: public_key,
      signatureAlgorithm: "EdDSA",
      name,
      symbol: symbol,
    };

    const tx = await contract.registerIssuer(issuer_did, issuerInfo);
    await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      message: `Đăng ký DID thành công: ${issuer_did}`,
    };
  } catch (error) {
    console.error("Lỗi khi đăng ký DID:", error);
    return {
      success: false,
      message: error.reason || error.message,
    };
  }
};

module.exports = {
  getIssuerProfile,
  createDegree,
  registerDID,
};
