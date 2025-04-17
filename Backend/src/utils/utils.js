const crypto = require("crypto");

const generateRandomString = (length = 64) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Mã hóa khóa riêng (giả lập, thay bằng thư viện thực tế như ethers.js)
const encryptPrivateKey = (privateKey, password) => {
  // TODO: Dùng thuật toán mã hóa thực tế
  const salt = crypto.randomBytes(16); // tạo salt ngẫu nhiên
  const iv = crypto.randomBytes(16); // vector khởi tạo ngẫu nhiên

  // Derive key từ password và salt
  const key = crypto.scryptSync(password, salt, 32);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Trả về salt, iv và ciphertext để có thể giải mã sau này
  return {
    encryptedData: encrypted,
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
  };
};

const decryptPrivateKey = (encryptedData, password, saltHex, ivHex) => {
  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.scryptSync(password, salt, 32);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = {
  generateRandomString,
  encryptPrivateKey,
  decryptPrivateKey,
};
