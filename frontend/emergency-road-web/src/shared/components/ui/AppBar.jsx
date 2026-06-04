// src/shared/components/ui/AppBar.jsx
export function AppBar({ title, leftAction, rightAction, transparent }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        background: transparent ? "rgba(255,255,255,0.72)" : "#ffffff",
        backdropFilter: transparent ? "blur(12px)" : undefined,
        WebkitBackdropFilter: transparent ? "blur(12px)" : undefined,
        borderBottom: `1px solid ${transparent ? "transparent" : "var(--border1)"}`,
      }}
    >
      <span
        style={{
          minWidth: 40,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {leftAction}
      </span>
      <h1
        style={{
          flex: 1,
          textAlign: "center",
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: "var(--ink1)",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </h1>
      <span
        style={{
          minWidth: 40,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {rightAction}
      </span>
    </header>
  );
}
