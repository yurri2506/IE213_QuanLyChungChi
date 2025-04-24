import CryptoJS from "crypto-js";

export const decryptPrivateKey = (encryptedData, password, saltHex, ivHex) => {
  try {
    const salt = CryptoJS.enc.Hex.parse(saltHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Hex.parse(encryptedData);

    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 10000,
    });

    const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error("Failed to decrypt. Possibly wrong password or format.");
    }

    return decryptedText;
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
};
