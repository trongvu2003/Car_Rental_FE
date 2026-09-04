import { useState, useEffect, useCallback } from "react";
import userApi from "../api/user.api";
import type { User } from "../types/user.types";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false); // THÊM STATE NÀY

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      setUpdating(true);
      const updatedUser = await userApi.updateUser(id, data);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Không thể cập nhật.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setDeleting(true);
      await userApi.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Không thể xoá người dùng."
      );
    } finally {
      setDeleting(false);
    }
  };

  return { users, loading, error, deleteUser, deleting, updateUser, updating };
};
