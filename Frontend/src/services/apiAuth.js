import axios from "axios";
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
