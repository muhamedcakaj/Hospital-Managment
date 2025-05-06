// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8085",
});

// Request interceptor: attach token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response+" "+error.response.status);
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refreshToken");
        console.log(refreshToken);
        const response = await axios.post("http://localhost:8085/auth/refresh-token", {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("refreshToken", newRefreshToken);
        console.log("token: "+newToken);
        console.log("refresh token: "+newRefreshToken)
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry the failed request
      } catch (refreshError) {
        // Refresh failed: logout
        sessionStorage.clear();
        // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;