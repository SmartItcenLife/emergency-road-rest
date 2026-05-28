function MapListPanel({
    hospitals,
    selectedHospital,
    onSelectHospital,
    loading,
    error
}) {
    return (
        <aside className="map-list-panel">
            <div className="map-list-header">
                <strong>병원 목록</strong>
                <span>{hospitals.length}개</span>
            </div>
            {loading && (
                <div className="map-list-message">병원 정보를 불러오는 중...</div>
            )}
            {error && (
                <div className="map-list-message">병원 정보를 불러오는 중 오류가 발생했습니다 : {error}</div>
            )}
            {!loading && !error && hospitals.length === 0 && (
                <div className="map-list-message">표시할 병원이 없습니다.</div>
            )}
            <div className="map-list">
                {hospitals.map((hospital) => {
                    const isSelected = selectedHospital?.hpid === hospital.hpid;
                    return (
                        <button
                            key={hospital.hpid}
                            type="button"
                            className={isSelected ? "map-list-item selected" : "map-list-item"}
                            onClick={() => onSelectHospital(hospital)}
                            ><strong>{hospital.hospitalName}</strong><br />
                            <span>{hospital.status?.label ?? "정보없음"}</span>
                            <p>{hospital.address ?? "주소 정보 없음"}</p>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}

export default MapListPanel;
    