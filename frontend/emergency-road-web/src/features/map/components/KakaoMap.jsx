import { useEffect, useRef, useState } from "react";
import { getMapBoundsParams } from "../utils/mapBounds";
import { getMapHospitals } from "../api/mapApi";
import { getMarkerColorByGrade } from "../utils/mapMarkerStyle";

const KAKAO_MAP_SDK_ID = "kakao-map-sdk";

function KakaoMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]); // Marker 인스턴스를 저장할 ref
  const debounceTimeoutRef = useRef(null); // 너무 잦은 API 호출을 막기 위한 디바운스 타임아웃 ref

  const [loading, setLoading] = useState(false); // 로딩 상태를 관리하는 state
  const [error, setError] = useState(null); // 에러 상태를 관리하는 state
  const [hospitalCount, setHospitalCount] = useState(0); // 현재 지도에 표시된 병원 수를 관리하는 state

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
      // ?. 옵셔널 체이닝은 windiow.kakao가 존재하는지 확인 후 진행 즉 있으면 window.kakao.maps 없으면 undefined 반환 하도록 하여 예외처리 방지.
      if (!window.kakao?.maps || !mapContainerRef.current) {
        return;
      }

      if (mapInstanceRef.current) {
        return;
      }

      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(37.5665, 126.978); // 서울 중심 좌표

        const options = {
          center,
          level: 7,
        };

        const map = new window.kakao.maps.Map(mapContainerRef.current, options);

        mapInstanceRef.current = map;

        // 지도의 중심이 변경될 때마다 병원 마커를 그림
        async function renderHospitalMarkers() {
          setLoading(true);
          setError(null);
          try {
            const boundsParams = getMapBoundsParams(map);
            const hospitals = await getMapHospitals(boundsParams);

            clearMarkers(); // 기존 마커 제거

            hospitals.forEach((hospital) => {
              const position = new window.kakao.maps.LatLng(
                hospital.latitude,
                hospital.longitude
              );
              
              // kakao.maps.Marker 인스턴스를 생성하여 기본 마커를 표시
              // const marker = new window.kakao.maps.Marker({
              //   map,
              //   position,
              //   title: hospital.hospitalName,
              // });

              const markerColor = getMarkerColorByGrade(hospital.status?.grade);
              const markerElement = document.createElement("div");
              markerElement.className = "map-hospital-marker";
              markerElement.style.backgroundColor = markerColor;
              markerElement.title = hospital.hospitalName;

              const marker = new window.kakao.maps.CustomOverlay({
                map,
                position,
                content: markerElement,
                yAnchor: 0.5, // 마커의 y축 앵커를 0.5로 설정하여 마커가 정확히 위치하도록 조정
                xAnchor: 0.5, // 마커의 x축 앵커를 0.5로 설정하여 마커가 정확히 위치하도록 조정
              })
            
              markersRef.current.push(marker);
            });
        } catch (err) {
            console.error("병원 데이터를 불러오는 중 오류가 발생했습니다:", err);
            setError("병원 데이터를 불러오는 중 오류가 발생했습니다.");
          } finally {
            setLoading(false);
            setHospitalCount(markersRef.current.length);
          }
      }

      // 초기 마커 생성 후 확대 및 이동 시 중복 마커 생성을 방지하기 위해 기존 마커를 제거하는 함수
      function clearMarkers() {
        markersRef.current.forEach((marker) => { 
          marker.setMap(null);
        });
        markersRef.current = [];
      }

      // debounce를 적용하여 지도의 중심이 변경될 때마다 너무 잦은 API 호출을 방지
      function debounceRenderHospitalMarkers() {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
          renderHospitalMarkers();
        }, 500); // 500ms 딜레이
      }

      renderHospitalMarkers();

      // map 객체가 생성된 뒤에 이벤트를 붙임 
      // idle 이벤트는 
      window.kakao.maps.event.addListener(map, "idle", debounceRenderHospitalMarkers);
        }
      );
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
  }, []);

  return (
    <div className="kakao-map-wrap">
    <div className="map-status-panel">
      {loading && <span>병원 정보를 불러오는 중...</span>}
      {!loading && !error && <span>표시 병원 {hospitalCount}개</span>}
      {error && <span>{error}</span>}
    </div>

    <div
      ref={mapContainerRef}
      className="kakao-map"
      aria-label="응급 병원 지도"
    />
  </div>
);
}

export default KakaoMap;
