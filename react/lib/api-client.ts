// @ts-ignore

import axios, { AxiosInstance } from "axios";

const { API_BASE_URL } = import.meta.env.VITE_API_BASE_URL;

const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const resolveApiError = (error: unknown) => {
  if (!axios.isAxiosError(error)) return { message: "An unknown error." };

  if (!error.response) return { message: "Can't reach to the server." };

  const data = error.response.data as {
    message: string | string[];
    error: string;
    statusCode: number;
  };

  return {
    message: Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message,
    error: data.error,
  };
};

export default Object.assign(apiClient, {
  resolveApiError,
});
