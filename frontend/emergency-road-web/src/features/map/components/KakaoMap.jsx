import { useEffect, useRef, useState } from "react";
import { getMapBoundsParams } from "../utils/mapBounds";
import { getMapStatusToneByGrade } from "../utils/mapStatusStyle";
import seoulDistrictPolygons from "../data/seoulDistrictPolygons.json";
import { getPolygonColor } from "../utils/mapPolygonStyle";
import locationIcon from "../../../assets/location.svg";

const KAKAO_MAP_SDK_ID = "kakao-map-sdk";

function KakaoMap({
  hospitals,
  selectedHospital,
  onBoundsChange,
  onSelectHospital,
  areaCongestions,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const debounceTimeoutRef = useRef(null);

  // hover 상태 관리를 위한 ref
  const infoOverlayRef = useRef([]);

  // 현재 활성화된 정보 오버레이를 추적하기 위한 ref
  const activeInfoOverlayRef = useRef(null);
  const ignoreNextMapClickRef = useRef(false);

  // 지도에 구별 혼잡도를 표기하기 위한 상태
  const polygonsRef = useRef([]);
  const areaInfoOverlayRef = useRef(null);
  const activeAreaOverlayRef = useRef(null);
  const activeAreaCodeRef = useRef(null);

  // 폴리곤 hover 상태 관리를 위한 ref
  const hoverAreaOverlayRef = useRef(null);

  // 사용자 위치를 관리하기 위한 Ref
  const currentLocationOverlayRef = useRef(null);
 
  const POLYGON_HIDE_LEVEL = 5;
  const AREA_CLICK_ZOOM_LEVEL = 5;
  
  // 지도 맵 레벨을 관리하기 위한 상태
  const AREA_MODE_LEVEL = 7; 
  
  const [mapLevel, setMapLevel] = useState(AREA_MODE_LEVEL);

  const shouldRenderPolygons = mapLevel > POLYGON_HIDE_LEVEL;

  
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

  // 폴리곤 제거 함수
  function clearPolygons() {
    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });

    polygonsRef.current = [];

    if (areaInfoOverlayRef.current) {
      areaInfoOverlayRef.current.setMap(null);
      areaInfoOverlayRef.current = null;
      }

    closeActiveAreaOverlay();
  }

  function closeHoverAreaOverlay() {
  if (hoverAreaOverlayRef.current) {
    hoverAreaOverlayRef.current.setMap(null);
    hoverAreaOverlayRef.current = null;
    }
  }
  // 사용자 위치로 이동
  function moveToCurrentLocation() {
    const map = mapInstanceRef.current;

    if (!map || !window.kakao?.maps) {
      return;
    }

    if (!navigator.geolocation) {
      alert("현재 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const currentPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );

        map.panTo(currentPosition);
        map.setLevel(5);
        setMapLevel(5);

        showCurrentLocationMarker(currentPosition);
      },
      (error) => {
        console.error("현재 위치를 가져오지 못했습니다:", error);
        alert("현재 위치를 가져오지 못했습니다. 위치 권한을 확인해주세요.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      }
    );
  }

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

  // 사용자 위치 overlay 구성 함수
  function showCurrentLocationMarker(position){
    const map = mapInstanceRef.current;

    if (!map || !window.kakao?.maps) {
      return;
    }

    if (currentLocationOverlayRef.current) {
      currentLocationOverlayRef.current.setMap(null);
    }

    const markerElement = document.createElement("div");
    markerElement.className = "map-current-location-marker";
    markerElement.setAttribute("aria-label", "현재 위치");

    const markerDot = document.createElement("span");
    markerDot.className = "map-current-location-dot";

    markerElement.appendChild(markerDot);

    const currentLocationOverlay = new window.kakao.maps.CustomOverlay({
      map,
      position,
      content: markerElement,
      xAnchor: 0.5,
      yAnchor: 0.5,
  });

  currentLocationOverlayRef.current = currentLocationOverlay;
  }


  
  // 줌 레벨에 따른 폴리곤 및 마커 색상 투명도 조절을 위한 상수 및 함수
  const polygonOpacity = getPolygonOpacityByLevel(mapLevel);
  const markerOpacity = getMarkerOpacityByLevel(mapLevel);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getPolygonOpacityByLevel(level) {
    if (level <= 3) {
      return {
        fillOpacity: 0,
        strokeOpacity: 0,
      };
    }

    const normalized = clamp((level - 3) / 5, 0, 1);

    return {
      fillOpacity: 0.06 + normalized * 0.26,
      strokeOpacity: 0.15 + normalized * 0.45,
    };
  }
  
  function getMarkerOpacityByLevel(level) {
    if (level <= 3) {
      return 1;
    }

    if (level <= 5) {
      return 0.85;
    }

    if (level <= 7) {
      return 0.6;
    }

    return 0.25;
  }


  function closeActiveAreaOverlay() {
    if (activeAreaOverlayRef.current) {
      activeAreaOverlayRef.current.setMap(null);
      activeAreaOverlayRef.current = null;
    }
    activeAreaCodeRef.current = null;
  }

  // GeoJson 좌표를 Kakao LatLng 배열로 변환하는 함수 ( 경도,위도 -> 위도,경도 )
  function convertCoordinatesToPath(coordinates) {
  return coordinates.map(([lon, lat]) => {
    return new window.kakao.maps.LatLng(lat, lon);
    });
  }

  // 활성화된 정보 오버레이가 있다면 닫는 함수
  function closeActiveInfoOverlay() {
    if (activeInfoOverlayRef.current) {
      activeInfoOverlayRef.current.setMap(null);
      activeInfoOverlayRef.current = null;
    }
  }

  // 
  function displayValue(value) {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return value;
  }

  function formatDateTime(value) {
    if (!value) {
      return "-";
    }

    return String(value).replace("T", " ").substring(0, 16);
  }

  function createAreaInfoContent(areaName, congestion) {
    const content = document.createElement("div");
    content.className = "map-area-info";

    content.innerHTML = `
      <strong>${areaName}</strong>
      <span>${congestion?.status?.label ?? "정보없음"}</span>
      <dl>
        <div>
          <dt>병원 수</dt>
          <dd>${displayValue(congestion?.hospitalCount)}개</dd>
        </div>
        <div>
          <dt>가용 병상</dt>
          <dd>${displayValue(congestion?.status?.availableCount)}개</dd>
        </div>
        <div>
          <dt>전체 병상</dt>
          <dd>${displayValue(congestion?.status?.totalCount)}개</dd>
        </div>
        <div>
          <dt>가용률</dt>
          <dd>${
            congestion?.status?.rate !== null &&
            congestion?.status?.rate !== undefined
              ? `${congestion.status.rate}%`
              : "-"
          }</dd>
        </div>
        <div>
          <dt>갱신 시간</dt>
          <dd>${formatDateTime(congestion?.recordedAt)}</dd>
        </div>
      </dl>
    `;

    return content;
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

        const initialLevel = map.getLevel();
        setMapLevel(initialLevel);

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

        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
          const currentLevel = map.getLevel();
          setMapLevel(currentLevel);
        });
        
        window.kakao.maps.event.addListener(map, "click", () => {
          if (ignoreNextMapClickRef.current) {
              ignoreNextMapClickRef.current = false;
              return;
            }
          closeHoverAreaOverlay();
          closeActiveAreaOverlay();
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

      const isSelected = selectedHospital?.hpid === hospital.hpid;
      // Marker 
      const statusTone = getMapStatusToneByGrade(hospital.status?.grade);
      const availableBeds = hospital.status?.availableCount
      const availableBedsText = typeof availableBeds == 'number' ? availableBeds : "정보없음";

      
      const markerElement = document.createElement("div");
      markerElement.className = isSelected
        ? `map-hospital-marker ${statusTone} selected`
        : `map-hospital-marker ${statusTone}`;
      markerElement.style.opacity = isSelected ? 1 : markerOpacity; // 선택된 병원이 더 잘 보이게
      markerElement.title = hospital.hospitalName
      markerElement.innerHTML = `
        <span class="map-hospital-marker-shape"></span>
        <strong class="map-hospital-marker-count">${availableBedsText}</strong>
      `;

      const infoContent = document.createElement("div");
      infoContent.className = "map-marker-info";
      infoContent.innerHTML = `
        <strong>${hospital.hospitalName}</strong>
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
        yAnchor: 1,
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
  }, [hospitals, selectedHospital, onSelectHospital, markerOpacity]);

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

  // polygon을 그리기 위한 useEffect  
  useEffect(() => {
  const map = mapInstanceRef.current;

  if (!map || !window.kakao?.maps) {
    return;
  }

  clearPolygons();

  if (!shouldRenderPolygons) {
    return;
  }

  const congestionMap = new Map(
    areaCongestions.map((area) => [area.areaCode, area])
  );

  seoulDistrictPolygons.features.forEach((feature) => {
    const areaCode = feature.properties.SIG_CD;
    const areaName = feature.properties.SIG_KOR_NM;
    const congestion = congestionMap.get(areaCode);

    const polygonColor = getPolygonColor(congestion?.status?.grade);
    const path = convertCoordinatesToPath(feature.geometry.coordinates[0]);

    const polygon = new window.kakao.maps.Polygon({
      map,
      path,
      strokeWeight: 2,
      strokeColor: polygonColor,
      strokeOpacity: polygonOpacity.strokeOpacity,
      fillColor: polygonColor,
      fillOpacity: polygonOpacity.fillOpacity,
    });

    const infoOverlay = new window.kakao.maps.CustomOverlay({
      content: createAreaInfoContent(areaName, congestion),
      position: path[0],
      xAnchor: 0.5,
      yAnchor: 1.2,
    });

    window.kakao.maps.event.addListener(polygon, "mouseover", (mouseEvent) => {
      polygon.setOptions({
        fillOpacity: Math.min(polygonOpacity.fillOpacity + 0.16, 0.55),
      });

      infoOverlay.setPosition(mouseEvent.latLng);
      infoOverlay.setMap(map);
      hoverAreaOverlayRef.current = infoOverlay;
    });

    window.kakao.maps.event.addListener(polygon, "mousemove", (mouseEvent) => {
      infoOverlay.setPosition(mouseEvent.latLng);
    });

    window.kakao.maps.event.addListener(polygon, "mouseout", () => {
        polygon.setOptions({
          fillOpacity: polygonOpacity.fillOpacity
        })
      
        infoOverlay.setMap(null);
      
        if ( activeAreaCodeRef.current === areaCode) {
            activeAreaCodeRef.current = null;
            activeAreaOverlayRef.current = null;
          }
        if (hoverAreaOverlayRef.current === infoOverlay) {
          hoverAreaOverlayRef.current = null;
        }
      });
    
      window.kakao.maps.event.addListener(map, "zoom_changed", () => {
        closeActiveAreaOverlay();
        closeActiveInfoOverlay();
        closeHoverAreaOverlay();

        const currentLevel = map.getLevel();
        setMapLevel(currentLevel);
      });

    window.kakao.maps.event.addListener(polygon, "click", (mouseEvent) => {
      if ( activeAreaCodeRef.current === areaCode) {
        closeActiveAreaOverlay();
        return;
      }

      closeActiveAreaOverlay();

      infoOverlay.setPosition(mouseEvent.latLng);
      infoOverlay.setMap(map);
      
      activeAreaOverlayRef.current = infoOverlay;
      activeAreaCodeRef.current = areaCode;

      map.panTo(mouseEvent.latLng);
      map.setLevel(AREA_CLICK_ZOOM_LEVEL, {
        anchor : mouseEvent.latLng
      });
    });

    
    polygonsRef.current.push(polygon);
  });
}, [areaCongestions, mapLevel, shouldRenderPolygons]);

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
