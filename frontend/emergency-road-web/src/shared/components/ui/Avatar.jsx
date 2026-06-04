// src/shared/components/ui/Avatar.jsx
export function Avatar({ name = "", src, size = 32 }) {
  const palettes = [
    ["#93C5FD", "#2563EB"],
    ["#BFDBFE", "#1E50C2"],
    ["#A8D5FF", "#1E40AF"],
    ["#C9DBF7", "#2563EB"],
    ["#B0CAEC", "#1E40AF"],
    ["#7DA8F0", "#1E3A8A"],
  ];
  const idx =
    [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % palettes.length;
  const [c1, c2] = palettes[idx];
  const initial = (name || "?").slice(0, 1);

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        fontSize: size * 0.42,
        flexShrink: 0,
        background: src
          ? `center/cover url(${src})`
          : `linear-gradient(135deg, ${c1}, ${c2})`,
      }}
    >
      {!src && initial}
    </span>
  );
}
