import { useState,useRef } from "react";
import KakaoMap from "./KakaoMap";
import { getAreaCongestion, getMapHospitals } from "../api/mapApi";
import MapSidePanel from "./MapSidePanel";
import { useEffect } from "react";

function MapLayout({initialCategory = "GENERAL", initialHospital = null }) {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(initialHospital);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 지도 이동이 완료된 후 병원 데이터를 불러오기 위한 상태
  const [pendingBounds, setPendingBounds] = useState(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  
  const hasSearchedOnceRef = useRef(false);

  // Polygon 데이터 및 구별 혼잡도 정보 상태
  const [areaCongestions, setAreaCongestions] = useState([]);
  const [areaCongestionLoading, setAreaCongestionLoading] = useState(false);
  const [areaCongestionError, setAreaCongestionError] = useState(null);

  useEffect(() => {
    loadAreaCongestions();
  }, []);

  // 지도 bounds 변경 시 호출되는 함수
  function handleBoundsChange(boundsParams) {
    setPendingBounds(boundsParams);

    if (!hasSearchedOnceRef.current) {
      hasSearchedOnceRef.current = true;
      searchHospitals(boundsParams);
      return;
    }

    setShowSearchButton(true);
  }

  // 실제 검색 실시
  async function searchHospitals(boundsParams) {
    try {
      setLoading(true);
      setError(null);

      const data = await getMapHospitals(initialCategory, boundsParams);
      setHospitals(data);
      setShowSearchButton(false);
    } catch (err) {
      console.error("병원 데이터를 불러오는 중 오류가 발생했습니다:", err);
      setError("병원 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 구별 혼잡도 조회
  async function loadAreaCongestions() {
    try {
      setAreaCongestionLoading(true);
      setAreaCongestionError(null);

      const data = await getAreaCongestion(initialCategory);
      setAreaCongestions(data);
    } catch (err) {
      console.error("구별 혼잡도 정보를 불러오는 중 오류가 발생했습니다:", err);
      setAreaCongestionError("구별 혼잡도 정보를 불러오지 못했습니다.");
    } finally {
      setAreaCongestionLoading(false);
    }
  }

  // 버튼 클릭 핸들러
  function handleSearchCurrentMap() {
    if (!pendingBounds) {
      return;
    }

    searchHospitals(pendingBounds);
  }

  // 병원 선택 핸들러 (선택된 병원을 다시 클릭하면 선택 해제)
  function handleSelectHospital(hospital) {
    setSelectedHospital((prev) => {
      if (prev?.hpid === hospital?.hpid) {
        return null;
      }

      return hospital;
    });
  }

  // 뒤로가기 핸들러 추가
  function handleBackToList() {
    setSelectedHospital(null);
  }

  return (
  <div 
    className={selectedHospital? "map-layout detail-mode" : "map-layout"}>
    <div className="map-content">
      {showSearchButton && (
        <button
          type="button"
          className="map-search-current-button"
          onClick={handleSearchCurrentMap}
        >
          현 지도에서 검색
        </button>
      )}

      <KakaoMap
        hospitals={hospitals}
        areaCongestions={areaCongestions}
        selectedHospital={selectedHospital}
        initialHospital={initialHospital}
        onBoundsChange={handleBoundsChange}
        onSelectHospital={handleSelectHospital}
      />
    </div>

    <MapSidePanel
      hospitals={hospitals}
      selectedHospital={selectedHospital}
      onSelectHospital={handleSelectHospital}
      onBackToList={handleBackToList}
      loading={loading}
      error={error}
    />
  </div>
);
}

export default MapLayout;