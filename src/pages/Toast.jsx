import React, { useEffect } from "react";

const Toast = ({ message, color = "bg-green-500", duration = 1500, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-md text-white shadow-md z-50 ${color} animate-fadeIn`}
    >
      {message}
    </div>
  );
};

export default Toast;
