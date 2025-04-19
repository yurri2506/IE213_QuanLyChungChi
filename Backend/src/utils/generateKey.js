const { buildEddsa, buildBabyjub } = require("circomlibjs");
const { BN } = require("bn.js");
const crypto = require("crypto");

//Tạo cặp khóa public key và private key
async function generateKey() {
  const eddsa = await buildEddsa();
  const babyJub = await buildBabyjub();

  // Tạo khóa riêng ngẫu nhiên
  const prvKey = crypto.randomBytes(32);

  const pubKey = eddsa.prv2pub(prvKey);

  const pPubKey = babyJub.packPoint(pubKey);

  console.log("Private Key: ", prvKey.toString("hex"));
  console.log("Public Key: ", pPubKey.toString("hex"));

  return { privateKey: prvKey, publicKey: new BN(pPubKey) };
}

module.exports = generateKey;
