import axios from "axios";
import { jwtDecode } from "jwt-decode";

const URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";


export const login = async (user_id, password) => {
  try {
    const response = await axios.post(`${URL}/auth/login`, {
      user_id,
      password,
    });
    return response.data;
  } catch (error) {
    return {
      message: error.response.data.message,
      status: "ERROR",
    };
  }
};

export const signupStudents = async (data) => {
  try {
    const response = await axios.post(`${URL}/auth/holders`, data, {
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

export const refreshTokenn = async (refreshToken) => {
  try {
    const response = await fetch(`${URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const data = await response.json();
    console.log(data);
    return data.access_token; // Trả về accessToken mới
  } catch (error) {
    console.error("Error in refreshToken:", error);
    throw error;
  }
};

export const ensureValidToken = async (dispatch,resetUser, refreshToken) => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    dispatch(resetUser());
    throw new Error("Access token not found.");
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Access token hết hạn, làm mới token
    const data = await refreshTokenn(refreshToken);
    localStorage.setItem("access_token", data);
    return data;
  }

  return accessToken; // Trả về accessToken hợp lệ
};

const roleEndpoints = {
  issuers: "issuers",
  verifiers: "verifiers",
  holders: "holders",
};

export const getUserDetails = async (userId, token, role) => {
  try {
    const endpoint = roleEndpoints[role];

    if (!endpoint) {
      throw new Error(`Unsupported role: ${role}`);
    }

    const response = await fetch(`${URL}/${endpoint}/get-details/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
};