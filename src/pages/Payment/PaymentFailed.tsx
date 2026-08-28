import { useNavigate } from "react-router-dom";
import { XCircle, Home, RotateCcw } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <XCircle size={64} color="#ef4444" style={{ margin: "0 auto 16px" }} />
        <h1 style={{ ...styles.title, color: "#ef4444" }}>
          Thanh toán thất bại
        </h1>
        <p style={styles.message}>
          Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Vui lòng
          kiểm tra lại số dư hoặc thử lại sau.
        </p>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate("/")}
            style={{ ...styles.button, ...styles.outlineButton }}
          >
            <Home size={18} />
            Về trang chủ
          </button>
          <button
            onClick={() => navigate(-1)} // Quay lại trang thanh toán trước đó
            style={{ ...styles.button, ...styles.dangerButton }}
          >
            <RotateCcw size={18} />
            Thử thanh toán lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    padding: "20px",
    backgroundColor: "#f9fafb",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    textAlign: "center" as const,
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#10b981",
    marginBottom: "12px",
  },
  message: {
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: "1.5",
    marginBottom: "32px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    flexDirection: "column" as const,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
  },
  dangerButton: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
  },
  outlineButton: {
    backgroundColor: "transparent",
    border: "1px solid #d1d5db",
    color: "#374151",
  },
};
