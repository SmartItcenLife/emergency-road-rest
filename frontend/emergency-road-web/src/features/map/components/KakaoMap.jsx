import { useEffect, useRef } from "react";
import { getMapBoundsParams } from "../utils/mapBounds";
import { getMarkerColorByGrade } from "../utils/mapMarkerStyle";

const KAKAO_MAP_SDK_ID = "kakao-map-sdk";

function KakaoMap({
  hospitals,
  selectedHospital,
  onBoundsChange,
  onSelectHospital,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const debounceTimeoutRef = useRef(null);

  // 지도에 표시된 마커를 모두 제거하는 함수
  function clearMarkers() {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    markersRef.current = [];
  }

  useEffect(() => {
    const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

    if (!kakaoMapKey) {
      console.error("VITE_KAKAO_MAP_KEY가 설정되어 있지 않습니다.");
      return;
    }

    if (!mapContainerRef.current) {
      return;
    }

    const createMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) {
        return;
      }

      if (mapInstanceRef.current) {
        return;
      }

      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(37.5665, 126.978);

        const options = {
          center,
          level: 7,
        };

        const map = new window.kakao.maps.Map(
          mapContainerRef.current,
          options
        );

        mapInstanceRef.current = map;

        function emitBoundsChange() {
          const boundsParams = getMapBoundsParams(map);
          onBoundsChange(boundsParams);
        }

        function emitBoundsChangeWithDebounce() {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }

          debounceTimeoutRef.current = setTimeout(() => {
            emitBoundsChange();
          }, 500);
        }

        emitBoundsChange();

        window.kakao.maps.event.addListener(
          map,
          "idle",
          emitBoundsChangeWithDebounce
        );
      });
    };

    const existingScript = document.getElementById(KAKAO_MAP_SDK_ID);

    if (existingScript) {
      if (window.kakao?.maps) {
        createMap();
      } else {
        existingScript.addEventListener("load", createMap, { once: true });
      }

      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_MAP_SDK_ID;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
    script.async = true;
    script.onload = createMap;

    document.head.appendChild(script);
  }, [onBoundsChange]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map || !window.kakao?.maps) {
      return;
    }

    clearMarkers();

    hospitals.forEach((hospital) => {
      const position = new window.kakao.maps.LatLng(
        hospital.latitude,
        hospital.longitude
      );

      const markerColor = getMarkerColorByGrade(hospital.status?.grade);
      const isSelected = selectedHospital?.hpid === hospital.hpid;

      const markerElement = document.createElement("div");
      markerElement.className = isSelected
        ? "map-hospital-marker selected"
        : "map-hospital-marker";
      markerElement.style.backgroundColor = markerColor;
      markerElement.title = hospital.hospitalName;

      markerElement.addEventListener("click", () => {
        onSelectHospital(hospital);
      });

      const marker = new window.kakao.maps.CustomOverlay({
        map,
        position,
        content: markerElement,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });

      markersRef.current.push(marker);
    });
  }, [hospitals, selectedHospital, onSelectHospital]);

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
  }, [selectedHospital]);

  return (
    <div
      ref={mapContainerRef}
      className="kakao-map"
      aria-label="응급 병원 지도"
    />
  );
}

export default KakaoMap;