import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3997/API/v1",
  // opcional: otros settings (headers, timeouts, etc.)
});

export default api;