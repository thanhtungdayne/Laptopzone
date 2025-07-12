"use client";

import React from "react";
import { useToast } from "./use-toast"; // sửa path cho đúng

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="assertive"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
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
              backgroundColor: "#333",
              color: "white",
              padding: "12px 20px",
              borderRadius: 6,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <strong>{title}</strong>
            {description && <div style={{ marginTop: 4 }}>{description}</div>}
          </div>
        ) : null
      )}
    </div>
  );
}
