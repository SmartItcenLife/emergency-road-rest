import KakaoMap from "./KakaoMap";
import MapSidePanel from "./MapSidePanel";
import { useNavigate } from "react-router-dom";
import { useMapHospitalSearch } from "../hooks/useMapHospitalSearch";
import "./MapLayout.css";

function MapLayout({initialCategory = "GENERAL", initialHospital = null }) {
  const navigate = useNavigate();
  const {
    hospitals,
    selectedHospital,
    loading,
    error,
    areaCongestions,
    showSearchButton,
    handleBoundsChange,
    handleSearchCurrentMap,
    handleSelectHospital,
    handleBackToList,
  } = useMapHospitalSearch({
    initialCategory,
    initialHospital,
  });

  return (
  <div 
    className={selectedHospital? "map-layout detail-mode" : "map-layout"}>
    <div className="map-content">
      <button
        type="button"
        className="map-floating-back-button"
        onClick={() => navigate(-1)}
        aria-label="이전 화면으로 이동"
      >
        ←
      </button>

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
