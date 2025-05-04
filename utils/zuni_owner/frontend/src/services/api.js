import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getWaitingDIDs = () => {
  return api.get("/waitingDIDs");
};

export const getIssuer = (did) => {
  return api.get(`/issuer/${did}`);
};

export const registerIssuer = (data) => {
  return api.post("/registerIssuer", data);
};

export const acceptIssuer = (did) => {
  return api.post("/acceptIssuer", { did });
};

export const declineIssuer = (did) => {
  return api.post("/declineIssuer", { did });
};

export const removeIssuer = (did, reason) => {
  return api.post("/removeIssuer", { did, reason });
};

export default api;
