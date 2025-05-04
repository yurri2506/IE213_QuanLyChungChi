const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load contract ABI
const contractABI = require("./contracts/RegistryDID.json");

// Setup provider and signer
const setupProvider = () => {
  try {
    return new ethers.JsonRpcProvider(process.env.RPC_URL);
  } catch (error) {
    console.error("Error setting up provider:", error);
    throw error;
  }
};

const setupSigner = (provider) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key not found in environment variables");
    }
    return new ethers.Wallet(privateKey, provider);
  } catch (error) {
    console.error("Error setting up signer:", error);
    throw error;
  }
};

const getContract = (signer) => {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("Contract address not found in environment variables");
    }
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

// API Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Get waiting DIDs
app.get("/api/waitingDIDs", async (req, res) => {
  try {
    const provider = setupProvider();
    const signer = setupSigner(provider);
    const contract = getContract(signer);

    const waitingDIDs = await contract.getWaitingDIDs();
    res.status(200).json({ waitingDIDs });
  } catch (error) {
    console.error("Error getting waiting DIDs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get issuer info
app.get("/api/issuer/:did", async (req, res) => {
  try {
    const { did } = req.params;
    const provider = setupProvider();
    const signer = setupSigner(provider);
    const contract = getContract(signer);

    const issuerInfo = await contract.getIssuer(did);
    res.status(200).json({ issuerInfo });
  } catch (error) {
    console.error("Error getting issuer info:", error);
    res.status(500).json({ error: error.message });
  }
});

// Register issuer
app.post("/api/registerIssuer", async (req, res) => {
  try {
    const { did, pubKey, signatureAlgorithm, name, symbol } = req.body;

    if (!did || !pubKey || !signatureAlgorithm) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const provider = setupProvider();
    const signer = setupSigner(provider);
    const contract = getContract(signer);

    const issuerInfo = {
      isRegistered: false, // This will be set to true by the contract
      pubKey: ethers.toUtf8Bytes(pubKey),
      signatureAlgorithm,
      name: name || "",
      symbol: symbol || "",
    };

    const tx = await contract.registerIssuer(did, issuerInfo);
    const receipt = await tx.wait();

    res.status(200).json({
      success: true,
      transactionHash: receipt.hash,
      message: "Issuer registration submitted successfully",
    });
  } catch (error) {
    console.error("Error registering issuer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Accept issuer
app.post("/api/acceptIssuer", async (req, res) => {
  try {
    const { did } = req.body;

    if (!did) {
      return res.status(400).json({ error: "Missing DID" });
    }

    const provider = setupProvider();
    const signer = setupSigner(provider);
    const contract = getContract(signer);

    const tx = await contract.acceptIssuer(did);
    const receipt = await tx.wait();

    res.status(200).json({
      success: true,
      transactionHash: receipt.hash,
      message: "Issuer accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting issuer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Decline issuer
app.post("/api/declineIssuer", async (req, res) => {
  try {
    const { did } = req.body;

    if (!did) {
      return res.status(400).json({ error: "Missing DID" });
    }

    const provider = setupProvider();
    const signer = setupSigner(provider);
    const contract = getContract(signer);

    const tx = await contract.declineIssuer(did);
    const receipt = await tx.wait();

    res.status(200).json({
      success: true,
      transactionHash: receipt.hash,
      message: "Issuer declined successfully",
    });
  } catch (error) {
    console.error("Error declining issuer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove issuer
app.post("/api/removeIssuer", async (req, res) => {
  try {
    const { did, reason } = req.body;

    if (!did || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const provider = setupProvider();
    const signer = setupSigner(provider);
    const contract = getContract(signer);

    const tx = await contract.removeIssuer(did, reason);
    const receipt = await tx.wait();

    res.status(200).json({
      success: true,
      transactionHash: receipt.hash,
      message: "Issuer removed successfully",
    });
  } catch (error) {
    console.error("Error removing issuer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
