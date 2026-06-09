import "./HospitalHeader.css";

/**
 * HospitalHeader — 병원 이름 + 로고 헤더
 * @param {string} hospitalName
 */
export function HospitalHeader({ hospitalName }) {
  return (
    <div className="hospital-header">
      <div className="hospital-header__text">
        <div className="hospital-header__label">응급실 커뮤니티</div>
        <h2 className="hospital-header__name">{hospitalName}</h2>
      </div>
    </div>
  );
}

export default HospitalHeader;
