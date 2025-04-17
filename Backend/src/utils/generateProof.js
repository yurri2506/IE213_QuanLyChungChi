const { groth16 } = require("snarkjs");
const wc = require("./zk_calculator/witness_calculator.js");
const fs = require("fs");
const { AbiCoder } = require("ethers");

//Tạo proof để  gửi cho verifier
async function main() {
  const degreeInput = JSON.parse(
    fs.readFileSync(__dirname + "/./input.example.json", "utf8")
  );

  // build witness calculator with webassembly
  const buffer = fs.readFileSync(__dirname + "/./zk_calculator/zuni.wasm");

  const witnessCalculator = await wc(buffer);
  const witnessFile = await witnessCalculator.calculateWTNSBin(degreeInput, 0);
  const zKeyFile = fs.readFileSync(
    __dirname + "/./zk_calculator/zuni_final.zkey"
  );
  const { proof, publicSignals } = await groth16.prove(zKeyFile, witnessFile);

  const dataStr = await groth16.exportSolidityCallData(proof, publicSignals);
  const data = JSON.parse("[" + dataStr + "]");

  const abiCoder = new AbiCoder();

  const bytes = abiCoder.encode(
    ["uint256[2]", "uint256[2][2]", "uint256[2]"],
    [data[0], data[1], data[2]]
  );

  console.log("Solidity Calldata");
  console.log("proof: " + bytes);
  console.log("major: 0x" + degreeInput.major.slice(2).padStart(64, "0"));

  const verifyKey = JSON.parse(
    fs.readFileSync(__dirname + "/./zk_calculator/verification_key.json")
  );
  const isVerify = await groth16.verify(verifyKey, publicSignals, proof);
  console.log("Verify:", isVerify);
}

main().catch((e) => console.log(e.message));
