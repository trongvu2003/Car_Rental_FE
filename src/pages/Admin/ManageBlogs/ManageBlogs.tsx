import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  X,
  Upload,
} from "lucide-react";
import { useBlogs, useBlogMutations } from "../../../hooks/useBlogs";
import type { Blog } from "../../../types/blog.types";
import "./ManageBlogs.css";

export default function ManageBlogs() {
  const { blogs, loading, error, refetch } = useBlogs();
  const {
    createBlog,
    updateBlog,
    deleteBlog,
    loading: isMutating,
  } = useBlogMutations();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    isPublished: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const filteredBlogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(q) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(q))
    );
  }, [blogs, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingBlogId(null);
    setFormData({ title: "", excerpt: "", content: "", isPublished: true });
    setImageFiles([]);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (blog: Blog) => {
    setEditingBlogId(blog.id);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt || "",
      content: blog.content,
      isPublished: blog.isPublished,
    });
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`))
      return;
    try {
      await deleteBlog(id);
      refetch();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 10) {
        alert("Chỉ được tải lên tối đa 10 ảnh.");
        return;
      }
      setImageFiles(files);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Vui lòng nhập Tiêu đề và Nội dung bài viết.");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("excerpt", formData.excerpt);
    submitData.append("content", formData.content);
    submitData.append("isPublished", String(formData.isPublished));

    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    try {
      if (editingBlogId) {
        await updateBlog(editingBlogId, submitData);
      } else {
        await createBlog(submitData);
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getMainImage = (blog: Blog) => {
    if (!blog.images || blog.images.length === 0) return null;
    const mainImg = blog.images.find((img) => img.is_main) || blog.images[0];
    return mainImg.image_url;
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div>
          <h2>Quản lý Bài viết (Blogs)</h2>
          <p className="subtitle">
            Thêm, sửa, xóa và theo dõi lượt xem các bài viết trên hệ thống
          </p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm tên bài viết, tóm tắt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            <span>Thêm bài viết</span>
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
                <th style={{ width: "100px" }}>Hình ảnh</th>
                <th>Thông tin bài viết</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Ngày đăng</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center empty-state">
                    Đang tải dữ liệu bài viết...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center empty-state">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div className="blog-thumbnail">
                        {getMainImage(blog) ? (
                          <img
                            src={getMainImage(blog)!}
                            alt={blog.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="blog-thumbnail-placeholder">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="cell-main blog-title" title={blog.title}>
                        {blog.title}
                      </div>
                      <div
                        className="cell-sub blog-excerpt"
                        title={blog.excerpt || ""}
                      >
                        {blog.excerpt || "Không có tóm tắt"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          blog.isPublished ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </td>
                    <td>
                      <div
                        className="drawer-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#475569",
                        }}
                      >
                        <Eye size={16} />
                        <span style={{ fontWeight: 600 }}>
                          {blog.viewCount.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-sub">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : new Date(blog.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                      </div>
                    </td>
                    <td className="action-cells">
                      <button
                        className="btn-icon view"
                        title="Chỉnh sửa bài viết"
                        onClick={() => handleOpenEditModal(blog)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Xóa bài viết"
                        onClick={() => handleDelete(blog.id, blog.title)}
                        disabled={isMutating}
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
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content blog-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingBlogId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </h3>
              <button
                className="btn-icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="modal-form">
              <div className="form-group">
                <label>
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Tóm tắt (Excerpt)</label>
                <textarea
                  rows={2}
                  placeholder="Đoạn văn ngắn giới thiệu nội dung..."
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  placeholder="Nội dung chính của bài viết..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Hình ảnh mới (Tối đa 10 ảnh - Tùy chọn)</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    id="blog-images-upload"
                  />
                  <label
                    htmlFor="blog-images-upload"
                    className="file-upload-label"
                  >
                    <Upload size={18} /> Chọn ảnh thay thế/thêm
                  </label>
                  <span className="file-count">
                    {imageFiles.length > 0
                      ? `Đã chọn ${imageFiles.length} ảnh`
                      : "Giữ nguyên ảnh cũ nếu không chọn"}
                  </span>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked,
                      })
                    }
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  Xuất bản công khai
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isMutating}
                >
                  {isMutating
                    ? "Đang xử lý..."
                    : editingBlogId
                    ? "Lưu thay đổi"
                    : "Đăng bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
