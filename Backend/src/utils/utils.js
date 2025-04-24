const crypto = require("crypto");
const { byteLengthOfData } = require("./constant");
const { BN } = require("bn.js");
const fs = require("fs");
const { buildBabyjub, buildPedersenHash } = require("circomlibjs");

const generateRandomString = (length = 64) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateZuniDID = (publicKeyHex) => {
  const hash = crypto
    .createHash("sha256")
    .update(publicKeyHex, "hex")
    .digest("hex");
  return hash;
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

// Chuyển một chuỗi thành dạng hex little-endian có độ dài cố định (mặc định 32 byte)
const stringToLeHex = (stringData, length = 32) => {
  const itemBuffer = Buffer.from(stringData);
  const itemBN = new BN(itemBuffer);
  const itemLe = itemBN.toBuffer("le", length);
  const itemLeHex = itemLe.toString("hex");

  return "0x" + itemLeHex;
};

// Chuyển một Buffer thành chuỗi hex ở định dạng little-endian
const bufferLe = (buf) => {
  const itemBN = new BN(buf);
  const itemLe = itemBN.toBuffer("le");
  const itemLeHex = itemLe.toString("hex");

  return "0x" + itemLeHex;
};

// Cắt một buffer 32 byte thành 2 phần 16 byte, rồi chuyển mỗi phần thành hex LE
const convertToLePartials = (fullBuf) => {
  return [bufferLe(fullBuf.slice(0, 16)), bufferLe(fullBuf.slice(16, 32))];
};

// Chuyển một số hoặc buffer thành chuỗi hex big-endian, có padding để đủ độ dài byte (default 32 byte)
const toHex = (number, length = 32) =>
  "0x" +
  (number instanceof Buffer
    ? number.toString("hex")
    : new BN(number).toString(16)
  ).padStart(length * 2, "0");

// Hash dữ liệu bằng Pedersen Hash sử dụng lib circomlibjs, trả về tọa độ x của điểm hash trên BabyJubjub curve (ở dạng string)
const pedersenHash = async (data) => {
  const babyJubBuilder = await buildBabyjub();
  const pedersenHashBuilder = await buildPedersenHash();
  const hashed = pedersenHashBuilder.hash(data);

  const unpackedPoint = babyJubBuilder.unpackPoint(hashed)[0];

  return babyJubBuilder.F.toString(unpackedPoint);
};

/*
Đọc dữ liệu chứng chỉ từ `data.json`,
→ chuyển từng field thành chuỗi hex little-endian đúng độ dài
→ nối toàn bộ lại thành chuỗi hex lớn
→ tạo Buffer từ chuỗi này
→ băm bằng Pedersen Hash
→ trả về hash string (sẽ dùng để làm leaf trong Merkle Tree)
*/
const getPedersenHashFromDegree = async () => {
  const dataStringify = fs.readFileSync("./scripts/data.json");
  const data = JSON.parse(dataStringify);
  let totalData = "";

  for (let key in data) {
    if (typeof data[key] === "object") {
      const parentValue = data[key];

      for (let childKey in parentValue) {
        const value = parentValue[childKey];
        const length = byteLengthOfData[key][childKey];

        const itemLeHex = stringToLeHex(value, length);

        totalData += itemLeHex.slice(2);
      }
    } else {
      const value = data[key];
      const length = byteLengthOfData[key];

      const itemLeHex = stringToLeHex(value, length);

      totalData += itemLeHex.slice(2);
    }
  }

  const buff = new BN(totalData, "hex").toBuffer();

  return pedersenHash(buff);
};

/*
Đọc dữ liệu `data.json` 
→ mỗi giá trị sẽ được chuyển sang hex string (không thay đổi thứ tự byte)
→ nếu là object (như ngày/tháng/năm), lặp qua từng phần tử
→ trả về một object JSON với các giá trị hex, để dùng làm input cho Circom
*/
const getInputFromDegree = (dataStringify) => {
  // const dataStringify = fs.readFileSync("./data.example.json");
  const data = JSON.parse(dataStringify);

  const input = {};

  for (let key in data) {
    if (typeof data[key] === "object") {
      const parentValue = data[key];
      const values = [];

      for (let childKey in parentValue) {
        const value = parentValue[childKey];

        const itemBuf = Buffer.from(value);
        const itemHex = "0x" + itemBuf.toString("hex");

        values.push(itemHex);
      }

      input[key] = values;
    } else {
      const value = data[key];

      const itemBuf = Buffer.from(value);
      const itemHex = "0x" + itemBuf.toString("hex");

      input[key] = itemHex;
    }
  }

  return input;
};

/*
Tương tự như `getPedersenHashFromDegree` nhưng chỉ trả về Buffer (không hash)
→ để dùng như thông điệp đầu vào (msg) cho ký số hoặc băm ngoài
*/
const getMsgFromDegree = (dataStringify) => {
  // const dataStringify = fs.readFileSync("./data.example.json");
  const data = JSON.parse(dataStringify);
  let totalData = "";

  for (let key in data) {
    if (typeof data[key] === "object") {
      const parentValue = data[key];

      for (let childKey in parentValue) {
        const value = parentValue[childKey];
        const length = byteLengthOfData[key][childKey];

        const itemLeHex = stringToLeHex(value, length);

        totalData += itemLeHex.slice(2);
      }
    } else {
      const value = data[key];
      const length = byteLengthOfData[key];

      const itemLeHex = stringToLeHex(value, length);

      totalData += itemLeHex.slice(2);
    }
  }

  const buff = new BN(totalData, "hex").toBuffer();

  return buff;
};

const hexToString = (inputJson) => {
  const output = {};

  const excludeKeys = ["pubKeyPartials", "r8Partials", "sPartials"];

  for (let key in inputJson) {
    if (excludeKeys.includes(key)) continue;

    const value = inputJson[key];

    if (Array.isArray(value)) {
      output[key] = value.map((hex) => {
        const hexStr = hex.startsWith("0x") ? hex.slice(2) : hex;
        return Buffer.from(hexStr, "hex").toString();
      });
    } else {
      const hexStr = value.startsWith("0x") ? value.slice(2) : value;
      output[key] = Buffer.from(hexStr, "hex").toString();
    }
  }

  return output;
};

const bufferFromLe = (hexStr) => {
  // Kiểm tra hexStr có phải là chuỗi không
  if (typeof hexStr !== "string") {
    throw new Error("Input must be a string.");
  }

  // Chắc chắn hexStr bắt đầu bằng "0x" và loại bỏ nó nếu có
  if (hexStr.startsWith("0x")) {
    hexStr = hexStr.slice(2); // bỏ "0x"
  }

  // Chuyển đổi chuỗi hex thành Buffer và đảo ngược
  return Buffer.from(hexStr, "hex").reverse();
};

const convertFromLePartials = (partials) => {
  if (partials.length !== 2) throw new Error("Must have exactly 2 partials");

  // Xử lý hai phần của signature và chuyển đổi sang định dạng Buffer
  const buf1 = bufferFromLe(partials[0]); // first 16 bytes
  const buf2 = bufferFromLe(partials[1]); // last 16 bytes

  return Buffer.concat([buf1, buf2]); // 32-byte buffer
};

const parseDate = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"), // Đảm bảo có 2 chữ số
    month: (date.getMonth() + 1).toString().padStart(2, "0"), // Lấy tháng, cộng 1 vì tháng bắt đầu từ 0
    year: date.getFullYear().toString(),
  };
};

module.exports = {
  generateRandomString,
  encryptPrivateKey,
  decryptPrivateKey,
  stringToLeHex,
  toHex,
  pedersenHash,
  getPedersenHashFromDegree,
  getInputFromDegree,
  getMsgFromDegree,
  bufferLe,
  convertToLePartials,
  convertFromLePartials,
  hexToString,
  parseDate,
  generateZuniDID,
};
