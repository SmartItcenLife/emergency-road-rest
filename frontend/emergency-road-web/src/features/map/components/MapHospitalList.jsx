import {
  getMapStatusColorByTone,
  getMapStatusRateForDisplay,
  getMapStatusToneByGrade,
} from "../utils/mapStatusStyle";
import { getPregnantNicuStatusByCounts } from "../utils/mapPregnantNicuStatus";

function displayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

function MapHospitalList({
  hospitals,
  onSelectHospital,
  loading,
  error,
}) {
  return (
    <>
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
        <div className="map-list-message error">
          병원 정보를 불러오지 못했습니다.
        </div>
      )}

      {!loading && !error && hospitals.length === 0 && (
        <div className="map-list-message">
          표시할 병원이 없습니다.
        </div>
      )}

      <div className="map-list">
        {hospitals.map((hospital) => {
          const statusGrade = hospital.status?.grade ?? "UNKNOWN";
          const statusTone = getMapStatusToneByGrade(statusGrade);
          const statusLabel = hospital.status?.label ?? "정보없음";
          const availableBeds = hospital.status?.availableCount;
          const totalBeds = hospital.status?.totalCount;
          const isPregnantCategory = hospital.category === "PREGNANT";
          const nicuStatus = getPregnantNicuStatusByCounts(
            availableBeds,
            totalBeds
          );
          const displayTone = isPregnantCategory ? nicuStatus.tone : statusTone;
          const displayLabel = isPregnantCategory ? nicuStatus.label : statusLabel;
          const displayRate = getMapStatusRateForDisplay(
            isPregnantCategory ? nicuStatus.rate : hospital.status?.rate
          );
          const displayColor = getMapStatusColorByTone(displayTone);

          return (
            <button
              key={hospital.hpid}
              type="button"
              className={`map-list-item-summary ${displayTone}`}
              onClick={() => onSelectHospital(hospital)}
            >
              <div className={`map-list-hospital-icon ${displayTone}`}>
                <span className="map-list-hospital-symbol" aria-hidden="true" />
              </div>

              <div className="map-list-hospital-content">
                <div className="map-list-hospital-title-row">
                  <strong>{hospital.hospitalName}</strong>
                  <span className={`map-status-badge ${displayTone}`}>
                    {displayLabel}
                  </span>
                </div>

                <p>{hospital.address ?? "주소 정보 없음"}</p>
              </div>

              <div
                className="map-list-status-donut"
                style={{
                  background: `conic-gradient(${displayColor} ${displayRate}%, #edf2f7 0)`,
                }}
              >
                <div className="map-list-status-donut-inner">
                  <strong>{isPregnantCategory ? "NICU" :displayLabel}</strong>
                  <span>
                    {displayValue(availableBeds)} / {displayValue(totalBeds)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default MapHospitalList;
