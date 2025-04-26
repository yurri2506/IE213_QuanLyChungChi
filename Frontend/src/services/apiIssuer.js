import axios from "axios";
const URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const getIssuerInfo = async () => {
  try {
    const response = await axios.get(`${URL}/issuers/get-details`, {
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

export const createDegrees = async (data) => {
  try {
    const response = await axios.post(`${URL}/issuers/degree`, data, {
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

export const getAllDegrees = async () => {
  try {
    const response = await axios.get(`${URL}/issuers/degrees`, {
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

export const getAllHolder = async (page) => {
  try {
    const response = await axios.get(
      `${URL}/issuers/get-all-holder?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      message: error.response?.data?.message || "An error occurred",
      status: "ERROR",
    };
  }
};

export const registryDID = async () => {
  try {
    const response = await axios.post(
      `${URL}/issuers/register-did`,
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
      message: error.response.data.message,
      status: "ERROR",
    };
  }
};
