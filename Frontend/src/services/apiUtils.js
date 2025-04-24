import axios from "axios";
const URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const getSignature = async (prvKey, degrees) => {
  try {
    const response = await axios.post(`${URL}/services/sign`, {
      privateKey: prvKey,
      degrees: degrees,
    });
    return response.data;
  } catch (error) {
    return {
      message: error.response.data.message,
      status: "ERROR",
    };
  }
};
