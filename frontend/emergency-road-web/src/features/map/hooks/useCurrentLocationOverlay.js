import { useRef } from "react";

export function useCurrentLocationOverlay({ mapRef, setMapLevel }) {
  const currentLocationOverlayRef = useRef(null);

  function showCurrentLocationMarker(position) {
    const map = mapRef.current;

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

    currentLocationOverlayRef.current = new window.kakao.maps.CustomOverlay({
      map,
      position,
      content: markerElement,
      xAnchor: 0.5,
      yAnchor: 0.5,
    });
  }

  function moveToCurrentLocation() {
    const map = mapRef.current;

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

  return {
    moveToCurrentLocation,
  };
}
