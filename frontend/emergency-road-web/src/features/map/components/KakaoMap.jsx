import { useCallback, useEffect, useRef } from "react";
import locationIcon from "../../../assets/location.svg";
import { useCurrentLocationOverlay } from "../hooks/useCurrentLocationOverlay";
import { useKakaoMap } from "../hooks/useKakaoMap";
import { useMapAreaPolygons } from "../hooks/useMapAreaPolygons";
import { useMapHospitalMarkers } from "../hooks/useMapHospitalMarkers";
import {
  POLYGON_HIDE_LEVEL,
} from "../utils/mapConfig";
import {
  getMarkerOpacityByLevel,
  getPolygonOpacityByLevel,
} from "../utils/mapOpacity";
import "./KakaoMap.css";

function KakaoMap({
  hospitals,
  selectedHospital,
  initialHospital,
  onBoundsChange,
  onSelectHospital,
  areaCongestions,
}) {
  const ignoreNextMapClickRef = useRef(false);

  const {
    mapContainerRef,
    mapInstanceRef,
    mapLevel,
    setMapLevel,
  } = useKakaoMap({
    initialHospital,
    onBoundsChange,
  });

  const markerOpacity = getMarkerOpacityByLevel(mapLevel);
  const polygonOpacity = getPolygonOpacityByLevel(mapLevel);
  const shouldRenderPolygons =
    !initialHospital && !selectedHospital && mapLevel > POLYGON_HIDE_LEVEL;
  const handleBeforeMarkerSelect = useCallback(() => {
    ignoreNextMapClickRef.current = true;
  }, []);

  const { closeActiveInfoOverlay } = useMapHospitalMarkers({
    mapRef: mapInstanceRef,
    hospitals,
    selectedHospital,
    initialHospital,
    markerOpacity,
    onSelectHospital,
    onBeforeMarkerSelect: handleBeforeMarkerSelect,
  });

  const {
    closeActiveAreaOverlay,
    closeHoverAreaOverlay,
  } = useMapAreaPolygons({
    mapRef: mapInstanceRef,
    areaCongestions,
    polygonOpacity,
    shouldRenderPolygons,
    closeHospitalOverlay: closeActiveInfoOverlay,
  });

  const { moveToCurrentLocation } = useCurrentLocationOverlay({
    mapRef: mapInstanceRef,
    setMapLevel,
  });

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map || !window.kakao?.maps) {
      return;
    }

    function handleMapClick() {
      if (ignoreNextMapClickRef.current) {
        ignoreNextMapClickRef.current = false;
        return;
      }

      closeHoverAreaOverlay();
      closeActiveAreaOverlay();
      closeActiveInfoOverlay();
      onSelectHospital(null);
    }

    window.kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [
    mapInstanceRef,
    closeHoverAreaOverlay,
    closeActiveAreaOverlay,
    closeActiveInfoOverlay,
    onSelectHospital,
  ]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map || !selectedHospital) {
      return;
    }

    const { latitude, longitude } = selectedHospital;

    if (latitude == null || longitude == null) {
      return;
    }

    const position = new window.kakao.maps.LatLng(latitude, longitude);
    map.panTo(position);
  }, [mapInstanceRef, selectedHospital]);

  function zoomIn() {
    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    const nextLevel = Math.max(map.getLevel() - 1, 1);
    map.setLevel(nextLevel);
    setMapLevel(nextLevel);
  }

  function zoomOut() {
    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    const nextLevel = map.getLevel() + 1;
    map.setLevel(nextLevel);
    setMapLevel(nextLevel);
  }

  return (
    <div className="kakao-map-wrapper">
      <div
        ref={mapContainerRef}
        className="kakao-map"
        aria-label="응급 병원 지도"
      />

      <div
        className="map-control-stack"
        aria-label="지도 조작 컨트롤"
      >
        <button
          type="button"
          className="map-control-button"
          onClick={zoomIn}
          aria-label="지도 확대"
        >
          +
        </button>
        <button
          type="button"
          className="map-control-button"
          onClick={zoomOut}
          aria-label="지도 축소"
        >
          -
        </button>
        <button
          type="button"
          className="map-control-button map-current-location-button"
          onClick={moveToCurrentLocation}
          aria-label="현재 위치로 이동"
        >
          <img src={locationIcon} alt="" />
        </button>
      </div>
    </div>
  );
}

export default KakaoMap;
