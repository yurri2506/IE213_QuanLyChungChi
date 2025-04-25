const Issuer = require("../models/issuers.model");
const Degree = require("../models/degrees.model");
const Holder = require("../models/holders.model");
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
const createDegrees = async (degreesData) => {
  const createdDegrees = [];

  for (const data of degreesData) {
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

    const holder = await Holder.findOne({ DID: holder_did });
    if (!holder) {
      throw new Error(`Holder not found for DID: ${holder_did}`);
    }

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
    createdDegrees.push(degree._id); // hoặc push toàn bộ object nếu muốn
  }

  return createdDegrees;
};

const getAllDegrees = async ({ issuer_did }) => {
  try {
    const degrees = await Degree.aggregate([
      {
        $match: { issuer_did },
      },
      {
        $lookup: {
          from: "holders", // collection name, tự động là dạng số nhiều và lowercase
          localField: "holder_did", // từ Degree
          foreignField: "DID", // từ Holder
          as: "holder_info",
        },
      },
      {
        $unwind: "$holder_info",
      },
      {
        $project: {
          major: 1,
          faculty: 1,
          year_graduation: 1,
          mode_of_study: 1,
          classification: 1,
          serial_number: 1,
          reference_number: 1,
          date_of_issue: 1,
          signature: 1,
          created_at: 1,
          updated_at: 1,
          holder_did: 1,
          issuer_did: 1,
          "holder_info.holder_id": 1,
          "holder_info.name": 1,
          "holder_info.date_of_birth": 1,
          "holder_info.gender": 1,
          "holder_info.place_of_birth": 1,
          "holder_info.major": 1,
          "holder_info.faculty": 1,
        },
      },
    ]);

    return degrees;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách degree:", error);
    throw new Error("Không thể lấy danh sách bằng cấp kèm thông tin holder.");
  }
};

const registerDID = async ({ issuer_did, public_key, name, symbol }) => {
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

    await Issuer.updateOne({ DID: issuer_did }, { registed_DID: "pending" });

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
  createDegrees,
  getAllDegrees,
  registerDID,
};
