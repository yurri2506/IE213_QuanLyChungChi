const crypto = require("crypto");
const { byteLengthOfData } = require("./constant");
const { BN } = require("bn.js");
const fs = require("fs");
const { buildBabyjub, buildPedersenHash } = require("circomlibjs");

function decryptPrivateKey(encryptedData, password, saltHex, ivHex) {
  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.scryptSync(password, salt, 32);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  console.log(decrypted);
  return decrypted;
}

decryptPrivateKey(
  "ea1bac8d2421a5b59a0c7c7f3ef1f5f19c6f252480476d216084cc6f4ceb40e554c45b5c507809525f05bc679ff3e41a58597716699d5cfd7d0ba4655042eb10ccd958eea7c9c3720e5ecab6bb5966ba",
  "123456",
  "940d411fdffdd196a692b116097747be",
  "ed73f17af9c0a0ebaa400d5fa01c2134"
).match((e) => console.log(e.message));
