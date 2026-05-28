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

  // hover 상태 관리를 위한 ref
  // const hoverHospitalIdRef = useRef(null);
  const infoOverlayRef = useRef([]);

  // 현재 활성화된 정보 오버레이를 추적하기 위한 ref
  const activeInfoOverlayRef = useRef(null);
  const ignoreNextMapClickRef = useRef(false);

  // 지도에 표시된 마커를 모두 제거하는 함수
  function clearMarkers() {
    closeActiveInfoOverlay();

    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    infoOverlayRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });

    infoOverlayRef.current = [];
    markersRef.current = [];
  }
  // 활성화된 정보 오버레이가 있다면 닫는 함수
  function closeActiveInfoOverlay() {
    if (activeInfoOverlayRef.current) {
      activeInfoOverlayRef.current.setMap(null);
      activeInfoOverlayRef.current = null;
    }
  }

  useEffect(() => {
    // Kakao SDK 로드
    // 지도 객체 생성
    // idle 이벤트 등록
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
        
        window.kakao.maps.event.addListener(map, "click", () => {
          if (ignoreNextMapClickRef.current) {
              ignoreNextMapClickRef.current = false;
              return;
            }
          closeActiveInfoOverlay();
          onSelectHospital(null);
        });

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
    // 기존 마커 제거
    // hospitals 기반 새 마커 생성
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

      const infoContent = document.createElement("div");
      infoContent.className = "map-marker-info";
      infoContent.innerHTML = `
        <strong>${hospital.hospitalName}</strong>
        <span>${hospital.status?.label ?? "정보없음"}</span>
        `;

      const infoOverlay = new window.kakao.maps.CustomOverlay({
        position,
        content: infoContent,
        yAnchor: 1.6,
        xAnchor: 0.5,
      });

      const marker = new window.kakao.maps.CustomOverlay({
        map,
        position,
        content: markerElement,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });

        markerElement.addEventListener("mouseover", () => {
          infoOverlay.setMap(map);
        });

        markerElement.addEventListener("mouseout", () => {
          if (activeInfoOverlayRef.current !== infoOverlay) {
            infoOverlay.setMap(null);
          }
        });

        markerElement.addEventListener("click", (event) => {
          event.stopPropagation();

          ignoreNextMapClickRef.current = true;
          onSelectHospital(hospital);
        });

      markersRef.current.push(marker);
      
      infoOverlayRef.current.push(infoOverlay);

      // 선택된 마커를 처리하는 함수
      if (isSelected){
        infoOverlay.setMap(map);
        activeInfoOverlayRef.current = infoOverlay;
      }

    });
  }, [hospitals, selectedHospital, onSelectHospital]);

  useEffect(() => {
    // selectedHospital 위치로 map.panTo
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