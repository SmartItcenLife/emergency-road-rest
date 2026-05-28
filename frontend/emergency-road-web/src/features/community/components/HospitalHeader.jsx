import logoMark from "../../../assets/logo.png";

const SURFACE = "#FFFFFF";
const BORDER1 = "#E2E6EE";
const ACCENT = "#2563EB";
const ACCENT_SOFT = "#EFF6FF";
const INK1 = "#0F1422";

/**
 * HospitalHeader — 병원 이름 + 로고 헤더
 * @param {string} hospitalName
 */
export function HospitalHeader({ hospitalName }) {
  return (
    <div
      style={{
        background: SURFACE,
        borderBottom: `1px solid ${BORDER1}`,
        padding: "20px 20px 22px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            color: ACCENT,
            fontWeight: 700,
            letterSpacing: "0.06em",
            marginBottom: 2,
          }}
        >
          응급실 커뮤니티
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 19,
            fontWeight: 700,
            color: INK1,
            letterSpacing: "-0.015em",
          }}
        >
          {hospitalName}
        </h2>
      </div>
    </div>
  );
}

export default HospitalHeader;
