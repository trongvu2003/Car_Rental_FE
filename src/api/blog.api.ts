import type {
  BlogQuery,
  BlogListResponse,
  BlogDetailResponse,
} from "../types/blog.types";
import axiosInstance from "./axios";

export const blogApi = {
  getBlogs: async (query?: BlogQuery): Promise<BlogListResponse> => {
    const response = await axiosInstance.get<BlogListResponse>("/blogs", {
      params: query,
    });
    return response.data;
  },

  getBlogById: async (
    id: string,
    increaseView: boolean = true
  ): Promise<BlogDetailResponse> => {
    try {
      const response = await axiosInstance.get<BlogDetailResponse>(
        `/blogs/${id}`,
        { params: { increaseView } }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Bài viết không tồn tại.");
      }
      throw new Error("Không thể tải bài viết.");
    }
  },

  createBlog: async (formData: FormData) => {
    const response = await axiosInstance.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBlog: async (id: string, formData: FormData) => {
    const response = await axiosInstance.put(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  },
};
