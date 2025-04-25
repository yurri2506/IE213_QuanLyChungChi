import axios from "axios";
const URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const checkVerifier = async (verifier_did) => {
  try {
    const response = await axios.get(`${URL}/verifiers/check/${verifier_did}`);
    return response.data;
  } catch (error) {
    return {
      message: error.response.data.message,
      status: "ERROR",
    };
  }
};
