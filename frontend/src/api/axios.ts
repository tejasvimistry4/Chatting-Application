import axios from "axios";

import { ENV } from "../config/env";

const api = axios.create({
  baseURL: ENV.API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

export default api;
