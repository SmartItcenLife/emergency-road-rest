import "./MapListPanel.css";
import { displayValue, formatDateTime } from "../utils/mapFormat";
import { getMapHospitalLabels } from "../utils/mapHospitalDisplay";

function displayStatusRate(hospital, metricLabels) {
    if (hospital.status?.rate !== null && hospital.status?.rate !== undefined) {
        return `${hospital.status.rate}%`;
    }

    if (metricLabels.ratioLabel === "분만 상태") {
        return hospital.status?.label ?? "정보없음";
    }

    return "-";
}

function MapHospitalDetail({ hospital }) {
    const category = hospital.category ?? "GENERAL";
    const metricLabels = getMapHospitalLabels(category);

    return (
        <div className="map-list-item-detail">
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
                <h3 className="map-detail-title">{metricLabels.title}</h3>
                <div className="map-detail-row">
                    <span>혼잡 상태</span>
                    <strong>{displayValue(hospital.status?.label ?? "정보없음")}</strong>
                </div>
                <div className="map-detail-row">
                    <span>{metricLabels.availableLabel}</span>
                    <strong>{displayValue(hospital.status?.availableCount)}</strong>
                </div>
                <div className="map-detail-row">
                    <span>{metricLabels.totalLabel}</span>
                    <strong>{displayValue(hospital.status?.totalCount)}</strong>
                </div>
                <div className="map-detail-row">
                    <span>{metricLabels.ratioLabel}</span>
                    <strong>{displayStatusRate(hospital, metricLabels)}</strong>
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

function MapListPanel({
  hospitals,
  selectedHospital,
  onSelectHospital,
  loading,
  error,
}) {
  return (
    <aside className="map-list-panel">
      <div className="map-list-header">
        <strong>병원 목록</strong>
        <span>{hospitals.length}개</span>
      </div>

      {loading && (
        <div className="map-list-message">
          병원 정보를 불러오는 중...
        </div>
      )}

      {error && (
        <div className="map-list-message">
          병원 정보를 불러오는 중 오류가 발생했습니다 : {error}
        </div>
      )}

      {!loading && !error && hospitals.length === 0 && (
        <div className="map-list-message">
          표시할 병원이 없습니다.
        </div>
      )}

      <div className="map-list">
        {hospitals.map((hospital) => {
          const isSelected = selectedHospital?.hpid === hospital.hpid;

          return (
            <article
              key={hospital.hpid}
              className={
                isSelected
                  ? "map-list-item selected"
                  : "map-list-item"
              }
            >
              <button
                type="button"
                className="map-list-item-summary"
                onClick={() => onSelectHospital(hospital)}
              >
                <strong>{hospital.hospitalName}</strong>
                <span>{hospital.status?.label ?? "정보없음"}</span>
                <p>{hospital.address ?? "주소 정보 없음"}</p>
              </button>

              {isSelected && (
                <MapHospitalDetail hospital={hospital} />
              )}
            </article>
          );
        })}
      </div>
    </aside>
  );
}

export default MapListPanel;
