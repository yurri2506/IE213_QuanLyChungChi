import { ethers } from "ethers";
import axios from "axios";
const URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const contractRegistryDIDABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "did",
        type: "string",
      },
    ],
    name: "AcceptedIssuer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "did",
        type: "string",
      },
    ],
    name: "DeclinedIssuer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "did",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "RemovedIssuer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "did",
        type: "string",
      },
    ],
    name: "acceptIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "did",
        type: "string",
      },
    ],
    name: "declineIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "did",
        type: "string",
      },
    ],
    name: "getIssuer",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isRegistered",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "pubKey",
            type: "bytes",
          },
          {
            internalType: "string",
            name: "signatureAlgorithm",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
        ],
        internalType: "struct IRegistryDID.IssuerInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWaitingDIDs",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "issuers",
    outputs: [
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "pubKey",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "signatureAlgorithm",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "did",
        type: "string",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "isRegistered",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "pubKey",
            type: "bytes",
          },
          {
            internalType: "string",
            name: "signatureAlgorithm",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
        ],
        internalType: "struct IRegistryDID.IssuerInfo",
        name: "issuerInfo",
        type: "tuple",
      },
    ],
    name: "registerIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "did",
        type: "string",
      },
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "removeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "waitingAcceptIssuers",
    outputs: [
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "pubKey",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "signatureAlgorithm",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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

    const contract = new ethers.Contract(
      contractAddress,
      contractRegistryDIDABI,
      signer
    );

    const issuerInfo = {
      isRegistered: true,
      pubKey: public_key,
      signatureAlgorithm: "EdDSA",
      name,
      symbol,
    };

    const tx = await contract.registerIssuer(issuer_did, issuerInfo);

    const receipt = await tx.wait();
    const response = await axios.put(
      `${URL}/issuers/update-registration-status`,
      {
        issuer_did,
        status: "pending",
        txHash: receipt.hash,
      }
    );

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

export const verifyProof = async ({ proofId, issuer_did, proof, major }) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask chưa được cài đặt");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = process.env.REACT_APP_VERIFYCATIONCENTER_ADDRESS;
    const contractRegistryDIDAddress =
      process.env.REACT_APP_REGISTRYDID_ADDRESS;

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
    if (tx) {
      const contractDID = new ethers.Contract(
        contractRegistryDIDAddress,
        contractRegistryDIDABI,
        signer
      );
      const txDID = await contractDID.getIssuer(issuer_did);
      console.log(txDID);
      const response = await axios.put(
        `${URL}/verifiers/update-proof-status`,
        {
          proofId: proofId,
          isVerified: tx,
          issuerName: txDID[3],
          issuerSymbol: txDID[4],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(response);
      if (!response.data.success) {
        throw new Error("Không thể cập nhật trạng thái đăng ký lên server");
      }
    }

    if (tx) {
      return {
        success: true,
        message: `Xác minh chứng chỉ thành công`,
      };
    } else {
      return {
        success: false,
        message: "Không thể xác minh chứng chỉ",
      };
    }
  } catch (error) {
    console.error("Lỗi khi xác minh!!");
  }
};
