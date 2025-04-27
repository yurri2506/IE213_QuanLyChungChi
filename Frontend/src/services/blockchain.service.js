import { ethers } from "ethers";
import axios from "axios";
const URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const contractABI = [
  "function registerIssuer(string did, tuple(bool isRegistered, bytes pubKey, string signatureAlgorithm, string name, string symbol) issuerInfo) external",
];

const contractCenterABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registryDID",
        type: "address",
      },
      {
        internalType: "address",
        name: "_verifier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "issuerDID",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "proofs",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "major",
        type: "bytes32",
      },
    ],
    name: "verifyOnEd25519",
    outputs: [
      {
        internalType: "bool",
        name: "result",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const registerDID = async ({ issuer_did, public_key, name, symbol }) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask chưa được cài đặt");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = process.env.REACT_APP_REGISTRYDID_ADDRESS;

    if (!contractAddress) {
      throw new Error("Địa chỉ contract không hợp lệ");
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const issuerInfo = {
      isRegistered: true,
      pubKey: public_key,
      signatureAlgorithm: "EdDSA",
      name,
      symbol,
    };

    const tx = await contract.registerIssuer(issuer_did, issuerInfo);

    const receipt = await tx.wait();
    const response = await axios.post(
      `${URL}/issuers/update-registration-status`,
      {
        issuer_did,
        status: "pending",
        txHash: receipt.hash,
      }
    );
    // // Nếu giao dịch thành công, cập nhật backend
    // const response = await fetch(`${URL}/issuers/update-registration-status`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     issuer_did,
    //     status: "pending",
    //     txHash: receipt.hash,
    //   }),
    // });
    console.log(response);
    if (!response.data.success) {
      throw new Error("Không thể cập nhật trạng thái đăng ký lên server");
    }

    return {
      success: true,
      txHash: receipt.hash,
      message: `Đăng ký DID thành công: ${issuer_did}`,
    };
  } catch (error) {
    console.error("Lỗi khi đăng ký DID:", error);

    let errorMessage = error.message || "Đã xảy ra lỗi không xác định";

    if (error.code === 4001) {
      errorMessage = "Bạn đã từ chối giao dịch";
    } else if (
      error.code === -32603 &&
      error.message.includes("execution reverted")
    ) {
      errorMessage = "Giao dịch bị revert. Có thể DID đã được đăng ký.";
    } else if (error.message.includes("insufficient funds")) {
      errorMessage = "Không đủ token để thực hiện giao dịch.";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const verifyProof = async ({ issuer_did, proof, major }) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask chưa được cài đặt");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = process.env.REACT_APP_VERIFYCATIONCENTER_ADDRESS;
    if (!contractAddress) {
      throw new Error("Địa chỉ contract không hợp lệ");
    }
    const contract = new ethers.Contract(
      contractAddress,
      contractCenterABI,
      signer
    );
    console.log(contract);

    const tx = await contract.verifyOnEd25519(issuer_did, proof, major);
    console.log(tx);
    // const receipt = await tx.wait();
    // const response = await axios.post(
    //   `${URL}/issuers/update-registration-status`,
    //   {
    //     issuer_did,
    //     status: "pending",
    //     txHash: receipt.hash,
    //   }
    // );

    // if (!response.data.success) {
    //   throw new Error("Không thể cập nhật trạng thái đăng ký lên server");
    // }

    return {
      success: true,
      txHash: tx,
      message: `Đăng ký DID thành công: ${issuer_did}`,
    };
  } catch (error) {
    console.error("Lỗi khi xác minh!!");
  }
};
