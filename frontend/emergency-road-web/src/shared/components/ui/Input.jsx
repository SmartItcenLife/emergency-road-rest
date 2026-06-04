// src/shared/components/ui/Input.jsx
import { useState } from "react";

export function Input({
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
  rightSlot,
  autoComplete,
  maxLength,
  onKeyDown,
}) {
  const [focus, setFocus] = useState(false);
  const border = error || focus ? "#2563EB" : "#E2E6EE"; // ← 수정

  return (
    <span style={{ position: "relative", display: "flex" }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        style={{
          font: "400 15px/1.4 inherit",
          padding: "12px 14px",
          paddingRight: rightSlot ? 44 : 14,
          border: `1px solid ${border}`,
          borderRadius: 8,
          background: "#fff",
          color: "#0F1422", // ← 수정
          width: "100%",
          boxSizing: "border-box",
          outline: "none",
          colorScheme: "light",
          boxShadow: focus ? "0 0 0 3px rgba(37,99,235,0.18)" : "none",
          transition: "all 150ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {rightSlot && (
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {rightSlot}
        </span>
      )}
    </span>
  );
}
