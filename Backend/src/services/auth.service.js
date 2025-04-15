const bcrypt = require("bcryptjs");
const Issuer = require("../models/issuers.model");
const Holder = require("../models/holders.model");
const Verifier = require("../models/verifiers.model");
const jwt = require("jsonwebtoken");

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

// Giả lập hàm tạo DID (thay bằng logic blockchain thực tế của bạn)
const createDID = async () => {
  // TODO: Tích hợp với hợp đồng DIDRegistry trên Polygon
  return {
    did: `did:ethr:${Date.now()}`, // Giả lập DID
    privateKey: `private_key_${Date.now()}`, // Giả lập khóa riêng
  };
};

// Mã hóa khóa riêng (giả lập, thay bằng thư viện thực tế như ethers.js)
const encryptPrivateKey = (privateKey, password) => {
  // TODO: Dùng thuật toán mã hóa thực tế
  return `encrypted_${privateKey}_${password}`; 
};

const registerIssuer = async (data) => {
  const { issuer_id, password, name } = data;
  const existingIssuer = await Issuer.findOne({ issuer_id });
  if (existingIssuer) throw new Error("Issuer ID already exists");

  const { did, privateKey } = await createDID();
  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptedPrivateKey = encryptPrivateKey(privateKey, password);

  const issuer = new Issuer({
    issuer_id,
    hashed_password: hashedPassword,
    DID: did,
    encrypted_private_key: encryptedPrivateKey,
    name,
  });

  await issuer.save();
  return { did, issuer_id };
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

  const { did, privateKey } = await createDID();
  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptedPrivateKey = encryptPrivateKey(privateKey, password);

  const holder = new Holder({
    holder_id,
    hashed_password: hashedPassword,
    DID: did,
    encrypted_private_key: encryptedPrivateKey,
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

  const { did, privateKey } = await createDID();
  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptedPrivateKey = encryptPrivateKey(privateKey, password);

  const verifier = new Verifier({
    verifier_id,
    hashed_password: hashedPassword,
    DID: did,
    encrypted_private_key: encryptedPrivateKey,
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