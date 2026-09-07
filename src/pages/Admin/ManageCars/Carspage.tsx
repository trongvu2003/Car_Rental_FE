import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  ImageIcon,
  Users,
  Fuel,
  Cog,
  Calendar,
} from "lucide-react";
import { useCars, useCarActions } from "../../../hooks/useCars";
import type {
  Car,
  CarStatus,
  FuelType,
  Transmission,
} from "../../../types/car.types";
import "./Carspage.css";
const STATUS_META: Record<CarStatus, { label: string; className: string }> = {
  available: { label: "Sẵn sàng", className: "badge-available" },
  rented: { label: "Đang thuê", className: "badge-rented" },
  maintenance: { label: "Bảo trì", className: "badge-maintenance" },
};

const STATUS_ORDER: CarStatus[] = ["available", "rented", "maintenance"];

const FUEL_LABEL: Record<FuelType, string> = {
  gasoline: "Xăng",
  diesel: "Dầu diesel",
  electric: "Điện",
};

const TRANSMISSION_LABEL: Record<Transmission, string> = {
  manual: "Số sàn",
  automatic: "Số tự động",
};

const currency = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const mainImage = (car: Car) =>
  car.images?.find((img) => img.is_main)?.image_url ??
  car.images?.[0]?.image_url;

function MenuPortal({
  top,
  left,
  children,
  onClickInside,
}: {
  top: number;
  left: number;
  children: React.ReactNode;
  onClickInside: (e: React.MouseEvent) => void;
}) {
  return createPortal(
    <div className="cp-menu" style={{ top, left }} onClick={onClickInside}>
      {children}
    </div>,
    document.body
  );
}

export default function ManageCarsPage() {
  const { cars, loading, error, refetch } = useCars();
  const {
    submitting,
    submitError,
    createCar,
    updateCar,
    deleting,
    deleteError,
    deleteCar,
  } = useCarActions();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CarStatus | "all">("all");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const [formOpen, setFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const close = () => setOpenMenuId(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("click", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("click", close);
    };
  }, [openMenuId]);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - 150) });
    setOpenMenuId(id);
  };

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [cars, statusFilter, query]);

  const openCreateForm = () => {
    setEditingCar(null);
    setFormOpen(true);
  };

  const openEditForm = (car: Car) => {
    setOpenMenuId(null);
    setEditingCar(car);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    setOpenMenuId(null);
    if (!window.confirm("Xóa xe này? Hành động không thể hoàn tác.")) return;
    try {
      await deleteCar(id);
      refetch();
    } catch {
      window.alert(deleteError || "Không thể xóa xe. Vui lòng thử lại.");
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingCar) {
        await updateCar(editingCar.id, formData);
      } else {
        await createCar(formData);
      }
      setFormOpen(false);
      setEditingCar(null);
      refetch();
    } catch {}
  };

  return (
    <div className="cars-page">
      <header className="cp-header">
        <div>
          <h1>Danh sách xe</h1>
          <p>Quản lý toàn bộ xe cho thuê trong hệ thống</p>
        </div>
        <button className="cp-primary-btn" onClick={openCreateForm}>
          <Plus size={16} /> Thêm xe
        </button>
      </header>

      <section className="cp-toolbar">
        <div className="cp-search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Tìm theo tên xe, hãng xe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="cp-filter-chips">
          <button
            className={
              statusFilter === "all" ? "cp-chip cp-chip-active" : "cp-chip"
            }
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              className={
                statusFilter === s ? "cp-chip cp-chip-active" : "cp-chip"
              }
              onClick={() => setStatusFilter(s)}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
      </section>

      {loading && <div className="cp-state">Đang tải danh sách xe...</div>}
      {!loading && error && <div className="cp-state cp-error">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="cp-state">
          Không tìm thấy xe phù hợp với bộ lọc hiện tại.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="cp-grid">
          {filtered.map((car) => (
            <div className="cp-card" key={car.id}>
              <div className="cp-card-image">
                {mainImage(car) ? (
                  <img src={mainImage(car)} alt={car.name} />
                ) : (
                  <div className="cp-card-image-placeholder">
                    <ImageIcon size={24} />
                  </div>
                )}
                <span className={`badge ${STATUS_META[car.status].className}`}>
                  {STATUS_META[car.status].label}
                </span>
                <button
                  className="cp-card-menu-btn"
                  onClick={(e) => toggleMenu(e, car.id)}
                >
                  <MoreVertical size={16} />
                </button>
                {openMenuId === car.id && (
                  <MenuPortal
                    top={menuPos.top}
                    left={menuPos.left}
                    onClickInside={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => openEditForm(car)}>
                      <Pencil size={14} /> Sửa thông tin
                    </button>
                    <button
                      className="cp-menu-delete"
                      onClick={() => handleDelete(car.id)}
                    >
                      <Trash2 size={14} /> Xóa xe
                    </button>
                  </MenuPortal>
                )}
              </div>

              <div className="cp-card-body">
                <div className="cp-card-title-row">
                  <h3>{car.name}</h3>
                  <span className="cp-card-price">
                    {currency(car.price_per_day)}
                    <span>/ngày</span>
                  </span>
                </div>
                <p className="cp-card-brand">{car.brand}</p>

                <div className="cp-card-specs">
                  {car.seats != null && (
                    <span>
                      <Users size={13} /> {car.seats} chỗ
                    </span>
                  )}
                  {car.fuel_type && (
                    <span>
                      <Fuel size={13} /> {FUEL_LABEL[car.fuel_type]}
                    </span>
                  )}
                  {car.transmission && (
                    <span>
                      <Cog size={13} /> {TRANSMISSION_LABEL[car.transmission]}
                    </span>
                  )}
                  {car.year != null && (
                    <span>
                      <Calendar size={13} /> {car.year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <CarFormDrawer
          initialCar={editingCar}
          submitting={submitting}
          submitError={submitError}
          onClose={() => {
            setFormOpen(false);
            setEditingCar(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Create / edit form, sliding in from the right                       */
/* ------------------------------------------------------------------ */
function CarFormDrawer({
  initialCar,
  submitting,
  submitError,
  onClose,
  onSubmit,
}: {
  initialCar: Car | null;
  submitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  const isEdit = !!initialCar;

  const [name, setName] = useState(initialCar?.name ?? "");
  const [brand, setBrand] = useState(initialCar?.brand ?? "");
  const [pricePerDay, setPricePerDay] = useState(
    initialCar?.price_per_day != null ? String(initialCar.price_per_day) : ""
  );
  const [status, setStatus] = useState<CarStatus>(
    initialCar?.status ?? "available"
  );
  const [description, setDescription] = useState(initialCar?.description ?? "");
  const [year, setYear] = useState(
    initialCar?.year != null ? String(initialCar.year) : ""
  );
  const [seats, setSeats] = useState(
    initialCar?.seats != null ? String(initialCar.seats) : ""
  );
  const [fuelType, setFuelType] = useState<FuelType | "">(
    initialCar?.fuel_type ?? ""
  );
  const [transmission, setTransmission] = useState<Transmission | "">(
    initialCar?.transmission ?? ""
  );

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewFiles((prev) => [...prev, ...files].slice(0, 10));
  };

  const removeNewFile = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const canSubmit = name.trim() && brand.trim() && pricePerDay.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("brand", brand.trim());
    formData.append("price_per_day", pricePerDay);
    if (isEdit) formData.append("status", status);
    if (description.trim()) formData.append("description", description.trim());
    if (year.trim()) formData.append("year", year);
    if (seats.trim()) formData.append("seats", seats);
    if (fuelType) formData.append("fuel_type", fuelType);
    if (transmission) formData.append("transmission", transmission);
    newFiles.forEach((file) => formData.append("images", file));

    onSubmit(formData);
  };

  return (
    <div className="cp-drawer-overlay" onClick={onClose}>
      <aside className="cp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cp-drawer-header">
          <h2>{isEdit ? "Sửa thông tin xe" : "Thêm xe mới"}</h2>
          <button className="cp-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="cp-form" onSubmit={handleSubmit}>
          <div className="cp-field-row">
            <label>
              Tên xe *
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Hãng xe *
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="cp-field-row">
            <label>
              Giá thuê / ngày (VNĐ) *
              <input
                type="number"
                min={0}
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
              />
            </label>
            {isEdit && (
              <label>
                Trạng thái
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CarStatus)}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="cp-field-row">
            <label>
              Năm sản xuất
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>
            <label>
              Số chỗ ngồi
              <input
                type="number"
                min={1}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </label>
          </div>

          <div className="cp-field-row">
            <label>
              Nhiên liệu
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
              >
                <option value="">Không chọn</option>
                <option value="gasoline">Xăng</option>
                <option value="diesel">Dầu diesel</option>
                <option value="electric">Điện</option>
              </select>
            </label>
            <label>
              Hộp số
              <select
                value={transmission}
                onChange={(e) =>
                  setTransmission(e.target.value as Transmission)
                }
              >
                <option value="">Không chọn</option>
                <option value="manual">Số sàn</option>
                <option value="automatic">Số tự động</option>
              </select>
            </label>
          </div>

          <label className="cp-field-full">
            Mô tả
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="cp-field-full">
            <span className="cp-field-label">Hình ảnh</span>

            {isEdit && initialCar?.images && initialCar.images.length > 0 && (
              <>
                <p className="cp-field-hint">Ảnh hiện có:</p>
                <div className="cp-image-grid">
                  {initialCar.images.map((img) => (
                    <div className="cp-image-thumb" key={img.id}>
                      <img src={img.image_url} alt="" />
                      {img.is_main && (
                        <span className="cp-image-main-tag">Chính</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <label className="cp-upload-box">
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFilesChange}
              />
              <ImageIcon size={18} />
              <span>
                Chọn ảnh để {isEdit ? "thêm" : "tải lên"} (tối đa 10 ảnh)
              </span>
            </label>

            {newPreviews.length > 0 && (
              <div className="cp-image-grid">
                {newPreviews.map((src, idx) => (
                  <div className="cp-image-thumb" key={src}>
                    <img src={src} alt="" />
                    <button
                      type="button"
                      className="cp-image-remove"
                      onClick={() => removeNewFile(idx)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {submitError && <div className="cp-form-error">{submitError}</div>}

          <div className="cp-form-actions">
            <button
              type="button"
              className="cp-secondary-btn"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="cp-primary-btn"
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm xe"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
