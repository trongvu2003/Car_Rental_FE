import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  // cho phép trình duyệt gửi/nhận cookie (kể cả httpOnly) cross-origin
  withCredentials: true,
});

// Nếu chưa đăng nhập hoặc token hết hạn (401), điều hướng về trang login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
