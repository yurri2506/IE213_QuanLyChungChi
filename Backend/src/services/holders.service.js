const Holder = require("../models/holders.model");
const Degree = require("../models/degrees.model");
const Verifier = require("../models/verifiers.model");
const Issuer = require("../models/issuers.model");
const Holder_Proofs = require("../models/holder_proofs.model");
const {
  convertFromLePartials,
  convertToLePartials,
  getInputFromDegree,
  parseDate,
} = require("../utils/utils");
const { ObjectId } = require("mongodb");
const { generateProofFromInput } = require("../utils/generateProof");

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

const createProof = async (holder_did, issuer_did, degree_id) => {
  const issuer = await Issuer.findOne({ DID: issuer_did });
  if (!issuer) {
    throw new Error("Issuer not found");
  }

  const degree = await Degree.findOne({
    _id: new ObjectId(degree_id),
    holder_did,
  });
  if (!degree) {
    console.log(
      `Degree not found for holder_did: ${holder_did}, degree_id: ${degree_id}`
    );
    throw new Error("Degree not found or does not belong to this holder");
  }

  const holder = await Holder.findOne({ DID: holder_did });
  if (!holder) {
    throw new Error("Holder not found");
  }

  // Lấy thông tin từ issuer và degree
  const degreeInfo = {
    name: holder.name, // tên của holder
    dateOfBirth: parseDate(holder.date_of_birth),
    schoolCode: issuer.school_code, // mã trường
    yearGraduation: degree.year_graduation, // năm tốt nghiệp
    major: degree.major, // chuyên ngành
    classification: degree.classification, // xếp loại
    modeOfStudy: degree.mode_of_study, // hình thức đào tạo
    serialNumber: degree.serial_number, // số hiệu văn bằng
    referenceNumber: degree.reference_number, // số vào sổ
    dateOfIssue: parseDate(degree.date_of_issue), // ngày cấp
  };

  const public_key = issuer.public_key;
  // console.log("public_key: ", public_key);
  const pPubKey = new Uint8Array(Buffer.from(public_key.slice(2), "hex")); // Bỏ "0x" trước khi chuyển
  console.log("pPubKey: ", pPubKey);

  // Lấy signature từ degree (signature đã lưu dưới dạng chuỗi hex)
  const signature = degree.signature;
  const pSignature = new Uint8Array(Buffer.from(signature, "hex"));
  console.log("pSignature: ", pSignature);
  const r8 = pSignature.slice(0, 32);
  const s = pSignature.slice(32, 64);

  const pubKeyPartials = convertToLePartials(pPubKey);
  const r8Partials = convertToLePartials(r8);
  const sPartials = convertToLePartials(s);
  const degreeInput = getInputFromDegree(JSON.stringify(degreeInfo)); // bạn cần chuẩn bị hàm này

  const proofObject = {
    pubKeyPartials,
    r8Partials,
    sPartials,
    ...degreeInput,
  };

  const { proof, major } = await generateProofFromInput(proofObject);

  const holderProof = new Holder_Proofs({
    holder_did,
    issuer_did,
    degree_id,
    proof,
    major,
  });
  await holderProof.save();

  return {
    issuer_did,
    proof,
    major,
  };
};

/**
 * Gửi ZKP + tuyên bố đến verifier
 */
const sendProofToVerifier = async (
  verifier_did,
  { proof, statement, holder_did }
) => {
  const verifier = await Verifier.findOne({ verifier_did });
  if (!verifier) throw new Error("Verifier not found");

  // Giả định lưu dữ liệu proof gửi đi vào database (tuỳ mục đích thực tế có thể khác)
  verifier.received_proofs = verifier.received_proofs || [];
  verifier.received_proofs.push({
    holder_did,
    statement,
    proof,
    received_at: new Date(),
  });
  await verifier.save();

  return {
    success: true,
    message: "Proof sent to verifier successfully",
  };
};

module.exports = {
  getHolderProfile,
  getDegreesByHolder,
  //sendProofToVerifier,
  createProof,
};
