const Issuer = require("../models/issuers.model");
const Degree = require("../models/degrees.model");
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

module.exports = {
  getIssuerProfile,
  createDegree,
};
