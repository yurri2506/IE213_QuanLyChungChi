const { buildEddsa } = require("circomlibjs");
const { getMsgFromDegrees } = require("../utils/utils");
const { BN } = require("bn.js");

async function signDegrees(privateKey, degrees) {
  const eddsa = await buildEddsa();

  const messages = getMsgFromDegrees(degrees); // Mảng buffer
  const prvKey = Buffer.from(privateKey, "hex");

  const signatures = messages.map((msg) => {
    const signature = eddsa.signPedersen(prvKey, msg);
    const pSignature = eddsa.packSignature(signature);
    const BNSignature = new BN(pSignature).toString("hex");
    return BNSignature;
  });

  return {
    signatures,
  };
}

module.exports = {
  signDegrees,
};
