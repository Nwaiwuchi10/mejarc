"use client";
import axios from "axios";

const Api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
});

Api.interceptors.request.use((config) => {
  // If authorization header is already explicitly set (e.g. agentToken), do not overwrite it
  if (config.headers && config.headers.Authorization) {
    return config;
  }
  
  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
