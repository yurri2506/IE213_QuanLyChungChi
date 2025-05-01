const Issuer = require("../models/issuers.model");
const Degree = require("../models/degrees.model");
const Holder = require("../models/holders.model");
const { ethers } = require("ethers");
const holdersModel = require("../models/holders.model");
require("dotenv").config();

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
const createDegrees = async (school_code, degreesData) => {
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

    const holder = await Holder.findOne({ DID: holder_did, school_code });
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

const getAllDegrees = async (issuer_did, page = 1) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  const degrees = await Degree.aggregate([
    {
      $match: {
        issuer_did: issuer_did,
      },
    },
    {
      $lookup: {
        from: "holders",
        localField: "holder_did",
        foreignField: "DID",
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
    {
      $sort: { created_at: -1 }, // Sort by created_at in descending order
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const totalDegrees = await Degree.countDocuments({
    issuer_did: issuer_did,
  });

  const totalPages = Math.ceil(totalDegrees / limit);

  return {
    degrees,
    pagination: {
      totalDegrees,
      totalPages,
      currentPage: page,
    },
  };
};

const getAllHolder = async (school_code, page = 1) => {
  try {
    const limit = 20; // Số lượng holder mỗi trang
    const skip = (page - 1) * limit; // Bỏ qua các holder của các trang trước
    const query = { school_code };
    const holders = await holdersModel.find(query).skip(skip).limit(limit);

    const totalHolders = await holdersModel.countDocuments(query); // Tổng số holder
    const totalPages = Math.ceil(totalHolders / limit); // Tổng số trang

    return {
      holders,
      pagination: {
        currentPage: page,
        totalPages,
        totalHolders,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách holder:", error);
    throw new Error("Không thể lấy danh sách holder.");
  }
};

// const registerDID = async ({ issuer_did, public_key, name, symbol }) => {
//   try {
//     if (!issuer_did || !public_key || !name || !symbol) {
//       throw new Error("Thiếu thông tin bắt buộc để đăng ký DID.");
//     }
//     const contractABI = [
//       "function registerIssuer(string did, tuple(bool isRegistered, bytes pubKey, string signatureAlgorithm, string name, string symbol) issuerInfo) external",
//     ];

//     const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
//     const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//     const contract = new ethers.Contract(
//       process.env.REGISTRYDID_ADDRESS,
//       contractABI,
//       wallet
//     );
//     const issuerInfo = {
//       isRegistered: true,
//       pubKey: public_key,
//       signatureAlgorithm: "EdDSA",
//       name,
//       symbol: symbol,
//     };

//     const tx = await contract.registerIssuer(issuer_did, issuerInfo);
//     await tx.wait();

//     await Issuer.updateOne({ DID: issuer_did }, { registed_DID: "pending" });

//     return {
//       success: true,
//       txHash: tx.hash,
//       message: `Đăng ký DID thành công: ${issuer_did}`,
//     };
//   } catch (error) {
//     console.error("Lỗi khi đăng ký DID:", error);
//     return {
//       success: false,
//       message: error.reason || error.message,
//     };
//   }
// };

const updateRegistrationStatus = async (issuer_did, status, txHash) => {
  try {
    await Issuer.updateOne(
      { DID: issuer_did },
      {
        registed_DID: status,
        registration_tx_hash: txHash,
        updated_at: new Date(),
      }
    );

    return {
      success: true,
      message: "Cập nhật trạng thái đăng ký thành công",
    };
  } catch (error) {
    throw new Error("Không thể cập nhật trạng thái đăng ký");
  }
};

module.exports = {
  getIssuerProfile,
  createDegrees,
  getAllDegrees,
  getAllHolder,
  // registerDID,
  updateRegistrationStatus,
};
