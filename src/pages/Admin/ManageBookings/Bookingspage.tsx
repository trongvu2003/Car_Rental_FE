import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Mail,
  Calendar,
  Car as CarIcon,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useBooking } from "../../../hooks/useBooking";
import type { Booking, BookingStatus } from "../../../types/booking.types";
import "./BookingsPage.css";

const carName = (b: Booking) => b.car?.name ?? "—";
const carBrand = (b: Booking) => b.car?.brand ?? "";
const carImage = (b: Booking) =>
  b.car?.images?.find((img) => img.is_main)?.image_url ??
  b.car?.images?.[0]?.image_url;
const userName = (b: Booking) => b.user?.name ?? "—";
const userEmail = (b: Booking) => b.user?.email ?? "";

const STATUS_META: Record<BookingStatus, { label: string; className: string }> =
  {
    pending: { label: "Chờ xác nhận", className: "badge-pending" },
    confirmed: { label: "Đã xác nhận", className: "badge-confirmed" },
    completed: { label: "Hoàn thành", className: "badge-completed" },
    cancelled: { label: "Đã hủy", className: "badge-cancelled" },
  };

const STATUS_ORDER: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

const currency = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function BookingsPage() {
  const {
    bookings,
    loading,
    error,
    fetchBookings,
    updateBookingStatus,
    deleteBooking,
    deleteMultipleBookings,
    deleting,
  } = useBooking();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [selected, setSelected] = useState<Booking | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.total_price || 0), 0);
    return { total, pending, confirmed, revenue };
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        userName(b).toLowerCase().includes(q) ||
        carName(b).toLowerCase().includes(q) ||
        carBrand(b).toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [bookings, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setOpenMenuId(null);
    try {
      await updateBookingStatus(id, status);
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch {}
  };

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("Xóa đơn đặt xe này?")) return;
    await deleteBooking(id);
    if (selected?.id === id) setSelected(null);
  };

  const handleDeleteSelected = async () => {
    if (checkedIds.size === 0) return;
    if (!window.confirm(`Xóa ${checkedIds.size} đơn đã chọn?`)) return;
    await deleteMultipleBookings(Array.from(checkedIds));
    setCheckedIds(new Set());
  };

  return (
    <div className="bookings-page">
      <header className="bp-header">
        <div>
          <h1>Đơn đặt xe</h1>
          <p>Theo dõi và xử lý toàn bộ đơn đặt xe của khách hàng</p>
        </div>
      </header>

      <section className="bp-stats">
        <div className="stat-card">
          <span className="stat-label">Tổng đơn</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Chờ xác nhận</span>
          <span className="stat-value accent-pending">{stats.pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Đã xác nhận</span>
          <span className="stat-value accent-ongoing">{stats.confirmed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Doanh thu (còn hiệu lực)</span>
          <span className="stat-value">{currency(stats.revenue)}</span>
        </div>
      </section>

      <section className="bp-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Tìm theo khách hàng, xe, biển số..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-chips">
          <button
            className={statusFilter === "all" ? "chip chip-active" : "chip"}
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
          >
            Tất cả
          </button>
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              className={statusFilter === s ? "chip chip-active" : "chip"}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>

        {checkedIds.size > 0 ? (
          <button
            className="icon-btn danger-btn"
            title="Xóa các đơn đã chọn"
            onClick={handleDeleteSelected}
            disabled={deleting}
          >
            <Trash2 size={16} />
            <span>Xóa ({checkedIds.size})</span>
          </button>
        ) : (
          <button className="icon-btn" title="Bộ lọc nâng cao">
            <SlidersHorizontal size={17} />
          </button>
        )}
      </section>

      <section className="bp-table-wrap">
        {loading && <div className="bp-state">Đang tải dữ liệu...</div>}

        {!loading && error && <div className="bp-state bp-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="bp-state">
            Không tìm thấy đơn đặt xe phù hợp với bộ lọc hiện tại.
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="bp-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}></th>
                <th>Khách hàng</th>
                <th>Xe thuê</th>
                <th>Thời gian thuê</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th aria-label="Hành động"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((b) => (
                <tr key={b.id} onClick={() => setSelected(b)}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checkedIds.has(b.id)}
                      onChange={() => toggleCheck(b.id)}
                    />
                  </td>
                  <td>
                    <div className="cell-user">
                      <div className="avatar">
                        {userName(b).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="cell-title">{userName(b)}</div>
                        <div className="cell-sub">{userEmail(b)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-user">
                      {carImage(b) && (
                        <img
                          className="car-thumb"
                          src={carImage(b)}
                          alt={carName(b)}
                        />
                      )}
                      <div>
                        <div className="cell-title">{carName(b)}</div>
                        <div className="cell-sub">{carBrand(b)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-title">
                      {formatDate(b.start_date)} — {formatDate(b.end_date)}
                    </div>
                  </td>
                  <td className="cell-price">{currency(b.total_price)}</td>
                  <td>
                    <span
                      className={
                        b.payment_status === "paid"
                          ? "pay-dot pay-paid"
                          : b.payment_status === "failed"
                          ? "pay-dot pay-refunded"
                          : "pay-dot pay-unpaid"
                      }
                    >
                      {b.payment_status === "paid"
                        ? "Đã thanh toán"
                        : b.payment_status === "failed"
                        ? "Thất bại"
                        : "Đang chờ"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${STATUS_META[b.status].className}`}
                    >
                      {STATUS_META[b.status].label}
                    </span>
                  </td>
                  <td
                    className="cell-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="icon-btn"
                      onClick={() =>
                        setOpenMenuId(openMenuId === b.id ? null : b.id)
                      }
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === b.id && (
                      <div className="status-menu">
                        {STATUS_ORDER.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(b.id, s)}
                            disabled={s === b.status}
                          >
                            {STATUS_META[s].label}
                          </button>
                        ))}
                        <button
                          className="status-menu-delete"
                          onClick={() => handleDeleteOne(b.id)}
                        >
                          Xóa đơn
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {!loading && !error && filtered.length > 0 && (
        <footer className="bp-pagination">
          <span>
            Hiển thị {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filtered.length)} trong {filtered.length}{" "}
            đơn
          </span>
          <div className="page-controls">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="page-current">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </button>
          </div>
        </footer>
      )}

      {selected && (
        <div className="bp-drawer-overlay" onClick={() => setSelected(null)}>
          <aside className="bp-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Chi tiết đơn đặt xe</h2>
              <button className="icon-btn" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>

            <span className={`badge ${STATUS_META[selected.status].className}`}>
              {STATUS_META[selected.status].label}
            </span>

            <div className="drawer-section">
              <h3>Khách hàng</h3>
              <div className="drawer-row">
                <span className="cell-title">{userName(selected)}</span>
              </div>
              {userEmail(selected) && (
                <div className="drawer-row">
                  <Mail size={15} /> {userEmail(selected)}
                </div>
              )}
            </div>

            <div className="drawer-section">
              <h3>Xe thuê</h3>
              {carImage(selected) && (
                <img
                  className="car-thumb-large"
                  src={carImage(selected)}
                  alt={carName(selected)}
                />
              )}
              <div className="drawer-row">
                <CarIcon size={15} /> {carName(selected)}
              </div>
              {carBrand(selected) && (
                <div className="drawer-row cell-sub">
                  Hãng xe: {carBrand(selected)}
                </div>
              )}
              {selected.car?.price_per_day != null && (
                <div className="drawer-row cell-sub">
                  Giá thuê: {currency(selected.car.price_per_day)}/ngày
                </div>
              )}
            </div>

            <div className="drawer-section">
              <h3>Thời gian</h3>
              <div className="drawer-row">
                <Calendar size={15} />
                {formatDate(selected.start_date)} —{" "}
                {formatDate(selected.end_date)}
              </div>
            </div>

            <div className="drawer-section">
              <h3>Thanh toán</h3>
              <div className="drawer-row cell-price">
                {currency(selected.total_price)}
              </div>
              <div className="drawer-row cell-sub">
                {selected.payment_status === "paid"
                  ? "Đã thanh toán"
                  : selected.payment_status === "failed"
                  ? "Thất bại"
                  : "Đang chờ"}
              </div>
            </div>

            <div className="drawer-section">
              <h3>Cập nhật trạng thái</h3>
              <div className="drawer-status-actions">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    className={
                      s === selected.status
                        ? "status-btn status-btn-active"
                        : "status-btn"
                    }
                    onClick={() => handleStatusChange(selected.id, s)}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="drawer-delete-btn"
              onClick={() => handleDeleteOne(selected.id)}
              disabled={deleting}
            >
              <Trash2 size={15} /> Xóa đơn đặt xe
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
