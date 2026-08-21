import axiosInstance from "./axios";
import type { LoginData, LoginResponse } from "../types/login.types";
import type { RegisterData } from "../types/register.types";

const authApi = {
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      data
    );
    // Backend đã set cookie httpOnly qua header Set-Cookie.
    // response.data chỉ còn { user }, không còn token nữa.
    return response.data;
  },

  // Gọi khi app load / F5 để hỏi "cookie này còn hợp lệ không, user là ai?"
  me: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    // Phải gọi API để backend clearCookie — FE không có quyền xóa cookie httpOnly
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};

export default authApi;
