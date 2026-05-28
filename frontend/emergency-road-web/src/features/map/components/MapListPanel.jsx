function displayValue(value) {
    if ( value == null || value == "" || value == undefined ) {
        return "-";
    }
    return value;
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) {
        return "-";
    }

    return dateTimeString.replace("T", " ").substring(0, 16);
}

function MapHospitalDetail({ hospital }) {
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
                <h3 className="map-detail-title">응급실 병상</h3>
                <div className="map-detail-row">
                    <span>혼잡 상태</span>
                    <strong>{displayValue(hospital.status?.label ?? "정보없음")}</strong>
                </div>
                <div className="map-detail-row">
                    <span>가용 병상 수</span>
                    <strong>{displayValue(hospital.status.availableCount)}</strong>
                </div>
                <div className="map-detail-row">
                    <span>총 병상 수</span>
                    <strong>{displayValue(hospital.status.totalCount)}</strong>
                </div>
                <div className="map-detail-row">
                    <span>가용률</span>
                    <strong>
                      {hospital.status?.rate !== null && hospital.status?.rate !== undefined
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