import axios from "axios";
const URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${URL}/holders/get-details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      message: error.response.data.message,
      status: "ERROR",
    };
  }
};

export const getDegreeInfo = async () => {
  try {
    const response = await axios.get(`${URL}/holders/degrees`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      message: error.response.data.message,
      status: "ERROR",
    };
  }
};

export const generateProof = async (degree_id) => {
  try {
    const response = await axios.post(
      `${URL}/holders/proofs/${degree_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      message: error,
      status: "ERROR",
    };
  }
};

export const sendProof2Verifier = async (verifer_did, data) => {
  try {
    console.log(data);
    const response = await axios.post(
      `${URL}/holders/verifiers/proofs/${verifer_did}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      message: error.response.data.message,
      status: "ERROR",
    };
  }
};
