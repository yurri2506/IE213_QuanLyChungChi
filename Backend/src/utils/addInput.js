const { buildEddsa, buildBabyjub } = require("circomlibjs");
const {
  getMsgFromDegrees,
  getInputFromDegree,
  convertToLePartials,
} = require("./utils");
const fs = require("fs");
const { BN } = require("bn.js");

//Phát hành chứng chỉ và ký chữ ký số  bằng prvKey
async function main(privateKey, degrees) {
  const eddsa = await buildEddsa();
  const babyJub = await buildBabyjub();

  const msg = getMsgFromDegree(degrees);

  const prvKey = Buffer.from(privateKey, "hex");

  console.log("prvKey: ", prvKey);

  const pubKey = eddsa.prv2pub(prvKey);
  // console.log("pubKey: ", pubKey);

  const pPubKey = babyJub.packPoint(pubKey);
  // console.log("pPubKey: ", pPubKey);

  const signature = eddsa.signPedersen(prvKey, msg);

  const pSignature = eddsa.packSignature(signature);
  console.log("pSignature: ", pSignature);

  const BNSignature = new BN(pSignature).toString("hex"); //Luu voi moi degree

  //   console.log("pSignature: ", new Uint8Array(Buffer.from(BNSignature, "hex")));
  //   // Tách từ đây
  //   const r8 = pSignature.slice(0, 32);
  //   const s = pSignature.slice(32, 64);

  //   const pubKeyPartials = convertToLePartials(pPubKey);
  //   const r8Partials = convertToLePartials(r8);
  //   const sPartials = convertToLePartials(s);

  //   const degree = getInputFromDegree();
  //   const input = {
  //     pubKeyPartials,
  //     r8Partials,
  //     sPartials,
  //     ...degree,
  //   };

  //   fs.writeFileSync("./input.example.json", JSON.stringify(input));
  //   console.log("\nAdded `input.json` file to `inputs/`\n");
}

main().catch((e) => console.log(e.message));
