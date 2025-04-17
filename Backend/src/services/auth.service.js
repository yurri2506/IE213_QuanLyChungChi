const bcrypt = require("bcryptjs");
const Issuer = require("../models/issuers.model");
const Holder = require("../models/holders.model");
const Verifier = require("../models/verifiers.model");
const jwt = require("jsonwebtoken");
const generateKey = require("../utils/generateKey");
const { BN } = require("bn.js");
const {
  generateRandomString,
  encryptPrivateKey,
  decryptPrivateKey,
} = require("../utils/utils");

const login = async (user_id, password) => {
  // Tìm user trong các bảng
  let user = await Issuer.findOne({ issuer_id: user_id });
  let role = "ISSUER";
  if (!user) {
    user = await Holder.findOne({ holder_id: user_id });
    role = "HOLDER";
  }
  if (!user) {
    user = await Verifier.findOne({ verifier_id: user_id });
    role = "VERIFIER";
  }

  if (!user) {
    throw new Error("User not found");
  }

  // So sánh mật khẩu
  const isValid = await bcrypt.compare(password, user.hashed_password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  // Tạo access_token
  const access_token = jwt.sign(
    { sub: user_id, role, did: user.DID },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Hết hạn sau 1 giờ
  );

  // Tạo refresh_token
  const refresh_token = jwt.sign(
    { sub: user_id, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Hết hạn sau 7 ngày
  );

  return { access_token, refresh_token, role, did: user.DID };
};

const refreshToken = async (refresh_token) => {
  try {
    // Verify refresh_token
    const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

    // Tạo access_token mới
    const access_token = jwt.sign(
      { sub: payload.sub, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { access_token };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

const registerIssuer = async (data) => {
  const { issuer_id, password, name, sympol } = data;
  const existingIssuer = await Issuer.findOne({ issuer_id });
  if (existingIssuer) throw new Error("Issuer ID already exists");

  const { privateKey, publicKey } = await generateKey();

  const did = generateRandomString(64);

  const hashedPassword = await bcrypt.hash(password, 10);
  const { encryptedData, salt, iv } = encryptPrivateKey(
    privateKey.toString("hex"),
    password
  );
  // const decryptedData = decryptPrivateKey(encryptedData, password, salt, iv);

  const issuer = new Issuer({
    issuer_id,
    hashed_password: hashedPassword,
    DID: did,
    encrypted_private_key: encryptedData,
    name: name,
    sympol: sympol,
    salt,
    iv,
  });

  await issuer.save();
  return {
    did,
    issuer_id,
    publicKey: publicKey.toString("hex"),
    privateKey: privateKey.toString("hex"),
    encrypted_private_key: encryptedData,
    name: name,
    sympol: sympol,
    // decryptPrivateKey: decryptedData,
  };
};

const registerHolder = async (data) => {
  const {
    holder_id,
    password,
    name,
    citizen_id,
    gender,
    date_of_birth,
    place_of_birth,
    major,
    faculty,
    time_of_training,
    mode_of_study,
  } = data;

  const existingHolder = await Holder.findOne({
    $or: [{ holder_id }, { citizen_id }],
  });
  if (existingHolder) throw new Error("Holder ID or Citizen ID already exists");

  const { privateKey, publicKey } = await generateKey();
  const did = generateRandomString(64);
  const hashedPassword = await bcrypt.hash(password, 10);
  const { encryptedData, salt, iv } = encryptPrivateKey(
    privateKey.toString("hex"),
    password
  );

  const holder = new Holder({
    holder_id,
    hashed_password: hashedPassword,
    DID: did,
    encrypted_private_key: encryptedData,
    salt,
    iv,
    name,
    citizen_id,
    gender,
    date_of_birth,
    place_of_birth,
    major,
    faculty,
    time_of_training,
    mode_of_study,
  });

  await holder.save();
  return { did, holder_id };
};

const registerVerifier = async (data) => {
  const { verifier_id, password, name, symbol } = data;
  const existingVerifier = await Verifier.findOne({ verifier_id });
  if (existingVerifier) throw new Error("Verifier ID already exists");

  const { privateKey, publicKey } = await generateKey();
  const did = generateRandomString(64);

  const hashedPassword = await bcrypt.hash(password, 10);
  const { encryptedData, salt, iv } = encryptPrivateKey(
    privateKey.toString("hex"),
    password
  );

  const verifier = new Verifier({
    verifier_id,
    hashed_password: hashedPassword,
    DID: did,
    encrypted_private_key: encryptedData,
    salt,
    iv,
    name,
    symbol,
  });

  await verifier.save();
  return { did, verifier_id };
};

module.exports = {
  registerIssuer,
  registerHolder,
  registerVerifier,
  login,
  refreshToken,
};
