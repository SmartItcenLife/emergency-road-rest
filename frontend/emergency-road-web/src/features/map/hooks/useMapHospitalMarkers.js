import { useCallback, useEffect, useRef } from "react";
import { createHospitalInfoContent } from "../utils/mapOverlayContent";
import { getHospitalMarkerStatus } from "../utils/mapHospitalMarkerStatus";

export function useMapHospitalMarkers({
  mapRef,
  hospitals,
  selectedHospital,
  initialHospital,
  markerOpacity,
  onSelectHospital,
  onBeforeMarkerSelect,
}) {
  const markersRef = useRef([]);
  const infoOverlayRef = useRef([]);
  const activeInfoOverlayRef = useRef(null);

  const closeActiveInfoOverlay = useCallback(() => {
    if (activeInfoOverlayRef.current) {
      activeInfoOverlayRef.current.setMap(null);
      activeInfoOverlayRef.current = null;
    }
  }, []);

  const clearMarkers = useCallback(() => {
    closeActiveInfoOverlay();

    markersRef.current.forEach((marker) => marker.setMap(null));
    infoOverlayRef.current.forEach((overlay) => overlay.setMap(null));

    markersRef.current = [];
    infoOverlayRef.current = [];
  }, [closeActiveInfoOverlay]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !window.kakao?.maps) {
      return;
    }

    clearMarkers();

    const markerHospitals =
      initialHospital &&
      !hospitals.some((hospital) => hospital.hpid === initialHospital.hpid)
        ? [initialHospital, ...hospitals]
        : hospitals;

    markerHospitals.forEach((hospital) => {
      const position = new window.kakao.maps.LatLng(
        hospital.latitude,
        hospital.longitude
      );

      const isSelected = selectedHospital?.hpid === hospital.hpid;
      const availableBeds = hospital.status?.availableCount;
      const markerStatus = getHospitalMarkerStatus(hospital);
      const displayTone = markerStatus.tone;
      const availableBedsText =
        typeof availableBeds === "number" ? availableBeds : "정보없음";

      const markerElement = document.createElement("div");
      markerElement.className = isSelected
        ? `map-hospital-marker ${displayTone} selected`
        : `map-hospital-marker ${displayTone}`;

      markerElement.style.opacity = isSelected ? 1 : markerOpacity;
      markerElement.title = hospital.hospitalName ?? "선택한 병원";
      markerElement.innerHTML = `
        <span class="map-hospital-marker-shape"></span>
        <strong class="map-hospital-marker-count">${availableBedsText}</strong>
      `;

      const infoOverlay = new window.kakao.maps.CustomOverlay({
        position,
        content: createHospitalInfoContent(hospital),
        yAnchor: 1.6,
        xAnchor: 0.5,
        zIndex: 10000,
      });

      const marker = new window.kakao.maps.CustomOverlay({
        map,
        position,
        content: markerElement,
        yAnchor: 1,
        xAnchor: 0.5,
        zIndex: isSelected ? 5000 : 1000,
      });

      markerElement.addEventListener("mouseover", () => {
        infoOverlay.setZIndex(10000);
        infoOverlay.setMap(map);
      });

      markerElement.addEventListener("mouseout", () => {
        if (activeInfoOverlayRef.current !== infoOverlay) {
          infoOverlay.setMap(null);
        }
      });

      markerElement.addEventListener("click", (event) => {
        event.stopPropagation();

        onBeforeMarkerSelect?.();
        onSelectHospital(hospital);
      });

      markersRef.current.push(marker);
      infoOverlayRef.current.push(infoOverlay);

      if (isSelected) {
        infoOverlay.setZIndex(10000);
        infoOverlay.setMap(map);
        activeInfoOverlayRef.current = infoOverlay;
      }
    });

    return clearMarkers;
  }, [
    mapRef,
    hospitals,
    selectedHospital,
    initialHospital,
    markerOpacity,
    onSelectHospital,
    onBeforeMarkerSelect,
    clearMarkers,
  ]);

  return {
    closeActiveInfoOverlay,
    clearMarkers,
  };
}
