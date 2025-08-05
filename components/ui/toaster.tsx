"use client";

import React, { useEffect } from "react";
import { useToast } from "./use-toast"; // sửa path cho đúng

export function Toaster() {
  const { toasts, dismiss } = useToast();

  // Tự động đóng toast sau 2 giây
  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (toast.open) {
        return setTimeout(() => dismiss(toast.id), 2000);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, dismiss]);

  return (
    <div
      aria-live="assertive"
      style={{
        position: "fixed",
        top: 55, // lùi xuống dưới Header
        right: 120, // gần giỏ hàng
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 9999,
        maxWidth: 300,
      }}
    >
      {toasts.map(({ id, title, description, open }) =>
        open ? (
          <div
            key={id}
            role="alert"
            onClick={() => dismiss(id)}
            style={{
              backgroundColor: "#6958EF",
              color: "white",
              padding: "12px 20px",
              borderRadius: 6,
              boxShadow: "0 4px 8px rgba(162, 43, 43, 0.2)",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <strong style={{ fontSize: 16, fontFamily: "Arial, Helvetica, sans-serif", }}>{title}</strong>
            {description && (
              <div style={{ marginTop: 4, fontSize: 14, fontFamily: "Arial, Helvetica, sans-serif", }}>{description}</div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
