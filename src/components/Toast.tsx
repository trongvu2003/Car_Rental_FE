import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import "./Toast.css";

export type ToastType = "success" | "error";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast = ({ type, message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast--${type}`} role="alert">
      {type === "success" ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
