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
        {hospitals.map((hospital) => (
          <button
            key={hospital.hpid}
            type="button"
            className="map-list-item-summary"
            onClick={() => onSelectHospital(hospital)}
          >
            <strong>{hospital.hospitalName}</strong>
            <span>{hospital.status?.label ?? "정보없음"}</span>
            <p>{hospital.address ?? "주소 정보 없음"}</p>
          </button>
        ))}
      </div>
    </>
  );
}

export default MapHospitalList;