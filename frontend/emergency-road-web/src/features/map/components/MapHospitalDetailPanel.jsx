function displayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return String(value).replace("T", " ").substring(0, 16);
}

// 혼잡도 색상을 나타내기 위한 함수
function getStatusTone(grade) {
  switch (grade) {
    case "RELAXED":
      return "relaxed";

    case "NORMAL":
      return "normal";

    case "CROWDED":
    case "VERY_CROWDED":
      return "crowded";

    case "UNKNOWN":
    default:
      return "unknown";
  }
}

function MapHospitalDetailPanel({ hospital, onBack }) {
  return (
    <div className="map-detail-panel">
      <div className="map-detail-panel-header">
        <button
          type="button"
          className="map-detail-back-button"
          onClick={onBack}
          aria-label="병원 목록으로 돌아가기"
        >
          ←
        </button>

        <strong>병원 상세</strong>
      </div>

      <div className="map-detail-hero">
        <div className="map-detail-image-placeholder">
          응급길
        </div>

        <h2>{hospital.hospitalName}</h2>
        <span className="map-detail-status">
          {hospital.status?.label ?? "정보없음"}
        </span>
      </div>

      <div className="map-detail-actions">
        {hospital.emergencyPhone && (
          <a
            href={`tel:${hospital.emergencyPhone}`}
            className="map-detail-action-button"
          >
            전화
          </a>
        )}

        <a
          href={`https://map.kakao.com/link/to/${encodeURIComponent(
            hospital.hospitalName
          )},${hospital.latitude},${hospital.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="map-detail-action-button"
        >
          길찾기
        </a>
      </div>

      <section className="map-detail-section">
        <h3 className="map-detail-title">기본 정보</h3>

        <div className="map-detail-row">
          <span>주소</span>
          <strong>{displayValue(hospital.address)}</strong>
        </div>

        <div className="map-detail-row">
          <span>응급실 번호</span>
          <strong>{displayValue(hospital.emergencyPhone)}</strong>
        </div>
      </section>

      <section className="map-detail-section">
        <h3 className="map-detail-title">응급실 병상</h3>

        <div className="map-detail-row">
          <span>가용 병상</span>
          <strong>{displayValue(hospital.status?.availableCount)}개</strong>
        </div>

        <div className="map-detail-row">
          <span>전체 병상</span>
          <strong>{displayValue(hospital.status?.totalCount)}개</strong>
        </div>

        <div className="map-detail-row">
          <span>가용률</span>
          <strong>
            {hospital.status?.rate !== null &&
            hospital.status?.rate !== undefined
              ? `${hospital.status.rate}%`
              : "-"}
          </strong>
        </div>
      </section>

      <section className="map-detail-section">
        <h3 className="map-detail-title">갱신 정보</h3>

        <div className="map-detail-row">
          <span>갱신 시간</span>
          <strong>{formatDateTime(hospital.recordedAt)}</strong>
        </div>
      </section>
    </div>
  );
}

export default MapHospitalDetailPanel;