import { useState, useEffect, useCallback } from "react";
import { blogApi } from "../api/blog.api";
import type { Blog, BlogQuery } from "../types/blog.types";

interface UseBlogsResult {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseBlogResult {
  blog: Blog | null;
  loading: boolean;
  error: string | null;
}

export const useBlogs = (query?: BlogQuery): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await blogApi.getBlogs(query);
      if (result.success && result.data) {
        setBlogs(result.data);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
};

export const useBlog = (id: string, increaseView = true): UseBlogResult => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await blogApi.getBlogById(id, increaseView);
        if (result.success && result.data) {
          setBlog(result.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ.");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Đã xảy ra lỗi không xác định.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, increaseView]);

  return { blog, loading, error };
};

export const useBlogMutations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createBlog = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogApi.createBlog(formData);
      return response;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Lỗi khi tạo bài viết";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogApi.updateBlog(id, formData);
      return response;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi cập nhật bài viết";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogApi.deleteBlog(id);
      return response;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Lỗi khi xóa bài viết";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    createBlog,
    updateBlog,
    deleteBlog,
    loading,
    error,
  };
};
