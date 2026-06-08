import { Icon } from "../../../../shared/components/ui";
import "./PasswordStrength.css";

const SUCCESS = "#1F8A5B";
const INK3 = "#7B8392";

const CHECKS = [
  { label: "영문", test: (v) => /[A-Za-z]/.test(v) },
  { label: "숫자", test: (v) => /\d/.test(v) },
  { label: "특수문자", test: (v) => /[@$!%*?&]/.test(v) },
  { label: "8자 이상", test: (v) => v.length >= 8 },
];

export function PasswordStrength({ value }) {
  return (
    <div className="password-strength__list">
      {CHECKS.map((c) => (
        <span
          key={c.label}
          className="password-strength__item"
          style={{ color: c.test(value) ? SUCCESS : INK3 }}
        >
          <Icon name="check" size={12} />
          {c.label}
        </span>
      ))}
    </div>
  );
}

export default PasswordStrength;
