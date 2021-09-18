import axios from "axios";

// Axios instance with preset api key header
export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:9000",
});
