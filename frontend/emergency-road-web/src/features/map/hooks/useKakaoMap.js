import { useEffect, useRef, useState } from "react";
import { getMapBoundsParams } from "../utils/mapBounds";
import {
  DEFAULT_CENTER,
  DEFAULT_LEVEL,
  INITIAL_HOSPITAL_LEVEL,
  KAKAO_MAP_SDK_ID,
} from "../utils/mapConfig";

export function useKakaoMap({
  initialHospital,
  onBoundsChange,
  onMapClick,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const [mapLevel, setMapLevel] = useState(DEFAULT_LEVEL);

  useEffect(() => {
    const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

    if (!kakaoMapKey) {
      console.error("VITE_KAKAO_MAP_KEY가 설정되어 있지 않습니다.");
      return;
    }

    if (!mapContainerRef.current) {
      return;
    }

    function createMap() {
      if (!window.kakao?.maps || !mapContainerRef.current) {
        return;
      }

      if (mapInstanceRef.current) {
        return;
      }

      window.kakao.maps.load(() => {
        const center =
          initialHospital?.latitude && initialHospital?.longitude
            ? new window.kakao.maps.LatLng(
                initialHospital.latitude,
                initialHospital.longitude
              )
            : new window.kakao.maps.LatLng(
                DEFAULT_CENTER.lat,
                DEFAULT_CENTER.lon
              );

        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center,
          level: initialHospital ? INITIAL_HOSPITAL_LEVEL : DEFAULT_LEVEL,
        });

        mapInstanceRef.current = map;
        setMapLevel(map.getLevel());

        function emitBoundsChange() {
          onBoundsChange(getMapBoundsParams(map));
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
          setMapLevel(map.getLevel());
        });

        if (onMapClick) {
          window.kakao.maps.event.addListener(map, "click", onMapClick);
        }
      });
    }

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

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [initialHospital, onBoundsChange, onMapClick]);

  return {
    mapContainerRef,
    mapInstanceRef,
    mapLevel,
    setMapLevel,
  };
}
