import { useEffect, useRef } from "react";
import { getMapBoundsParams } from "../utils/mapBounds";
import { getMapHospitals } from "../api/mapApi";

const KAKAO_MAP_SDK_ID = "kakao-map-sdk";

function KakaoMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
        const center = new window.kakao.maps.LatLng(37.5665, 126.978); // 서울 중심 좌표

        const options = {
          center,
          level: 7,
        };

        const map = new window.kakao.maps.Map(mapContainerRef.current, options);

        mapInstanceRef.current = map;

        async function fetchHospitalsInBounds() {
        const boundsParams = getMapBoundsParams(map);
        const hospitals = await getMapHospitals(boundsParams);
        console.log("지도 범위 내 병원:", hospitals);
      }

      fetchHospitalsInBounds();

        mapInstanceRef.current = new window.kakao.maps.Map(
          mapContainerRef.current,
          options
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
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="kakao-map"
      aria-label="응급 병원 지도"
    />
  );
}

export default KakaoMap;