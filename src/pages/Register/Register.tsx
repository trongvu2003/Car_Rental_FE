import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, User, Mail, Lock, Eye, EyeOff, Power } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Toast, { ToastType } from "../../components/Toast";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const { register, loading, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password || !confirmPassword) {
      setFormError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password.length < 8) {
      setFormError("Mật khẩu cần tối thiểu 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await register(name, email, password);

      setToast({
        type: "success",
        message: "Đăng ký thành công! Đang chuyển đến trang đăng nhập...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Đăng ký thất bại." });
    }
  };

  return (
    <div className="auth-page">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <Car size={22} color="#C9A84C" />
          <span>
            PRESTIGE<strong>DRIVE</strong>
          </span>
        </Link>

        <h1>Đăng ký</h1>
        <p className="auth-subtitle">Tạo tài khoản để đặt xe ưu tiên</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ tên</label>
            <div className="input-control">
              <User size={17} />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-control">
              <Mail size={17} />
              <input
                type="email"
                placeholder="ban@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-control">
              <Lock size={17} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div
              className={`input-control ${
                formError === "Mật khẩu xác nhận không khớp."
                  ? "input-control--error"
                  : ""
              }`}
            >
              <Lock size={17} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {(formError || error) && (
            <p className="auth-error">{formError || error}</p>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            <Power size={16} className={loading ? "spin" : ""} />
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
