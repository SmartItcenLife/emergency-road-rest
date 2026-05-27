import { useState } from "react";
import KakaoMap from "./KakaoMap";
import { getMapHospitals } from "../api/mapApi";

function MapLayout() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleBoundsChange(boundsParams) {
    try {
      setLoading(true);
      setError(null);

      const data = await getMapHospitals(boundsParams);
      setHospitals(data);
    } catch (err) {
      console.error("병원 데이터를 불러오는 중 오류가 발생했습니다:", err);
      setError("병원 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // 해당 부분은 임시로 API 결과를 확인하기 위한 임시 UI 입니다.
    <div className="map-layout">
      <div className="map-status-panel">
        {loading && <span>병원 정보를 불러오는 중...</span>}
        {!loading && !error && <span>표시 병원 {hospitals.length}개</span>}
        {error && <span>{error}</span>}
      </div>

      <KakaoMap
        hospitals={hospitals}
        selectedHospital={selectedHospital}
        onBoundsChange={handleBoundsChange}
        onSelectHospital={setSelectedHospital}
      />
    </div>
  );
}

export default MapLayout;