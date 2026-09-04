import { useState, useMemo } from "react";
import { Search, Plus, Edit, Trash2, Mail, X } from "lucide-react";
import { useAdminUsers } from "../../../hooks/useAdminUsers";
import type { User } from "../../../types/user.types";
import "./Userspage.css";

export default function UsersPage() {
  const { users, loading, error, deleteUser, deleting, updateUser, updating } =
    useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{ role: "admin" | "user" }>({
    role: "user",
  });

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xoá tài khoản "${name}" không?`))
      return;
    try {
      await deleteUser(id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Mở modal và gán Role hiện tại (ĐÃ ÉP KIỂU)
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({ role: (user.role as "admin" | "user") || "user" });
  };

  // Xử lý lưu form (Chỉ gửi Role lên Backend)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, editFormData);
      setEditingUser(null); // Đóng modal khi thành công
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div>
          <h2>Quản lý Khách hàng</h2>
          <p className="subtitle">
            Quản lý thông tin tài khoản và phân quyền người dùng
          </p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary">
            <Plus size={18} />
            <span>Thêm tài khoản</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thông tin người dùng</th>
                <th>Mã Khách hàng (ID)</th>
                <th>Liên hệ</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center empty-state">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center empty-state">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="cell-user">
                        <div className="avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="cell-main">{user.name}</div>
                          {/* Hiển thị Role thực tế trên bảng */}
                          <div
                            className="cell-sub"
                            style={{
                              color:
                                user.role === "admin" ? "#d97706" : "#64748b",
                              fontWeight: user.role === "admin" ? "600" : "400",
                            }}
                          >
                            {user.role === "admin"
                              ? "Quản trị viên"
                              : "Thành viên"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-sub">
                        {user.id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div
                        className="drawer-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.9rem",
                          color: "#475569",
                        }}
                      >
                        <Mail size={15} />
                        {user.email}
                      </div>
                    </td>
                    <td className="action-cells">
                      <button
                        className="btn-icon view"
                        title="Phân quyền"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Xóa tài khoản"
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={deleting}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Phân quyền người dùng</h3>
              <button className="btn-icon" onClick={() => setEditingUser(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-group">
                <label>Tài khoản</label>
                <input
                  type="text"
                  value={`${editingUser.name} (${editingUser.email})`}
                  disabled
                  style={{ backgroundColor: "#f8fafc", color: "#94a3b8" }}
                />
              </div>

              <div className="form-group">
                <label>Vai trò (Role)</label>
                <select
                  className="role-select"
                  value={editFormData.role}
                  onChange={(e) =>
                    setEditFormData({
                      role: e.target.value as "admin" | "user",
                    })
                  }
                >
                  <option value="user">Thành viên (User)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingUser(null)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={updating}
                >
                  {updating ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
