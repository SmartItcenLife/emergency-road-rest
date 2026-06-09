import { useCallback, useEffect, useRef } from "react";
import seoulDistrictPolygons from "../data/seoulDistrictPolygons.json";
import { AREA_CLICK_ZOOM_LEVEL } from "../utils/mapConfig";
import { createAreaInfoContent } from "../utils/mapOverlayContent";
import { getPolygonColor } from "../utils/mapPolygonStyle";

function convertCoordinatesToPath(coordinates) {
  return coordinates.map(([lon, lat]) => {
    return new window.kakao.maps.LatLng(lat, lon);
  });
}

export function useMapAreaPolygons({
  mapRef,
  areaCongestions,
  polygonOpacity,
  shouldRenderPolygons,
  closeHospitalOverlay,
}) {
  const polygonsRef = useRef([]);
  const activeAreaOverlayRef = useRef(null);
  const activeAreaCodeRef = useRef(null);
  const hoverAreaOverlayRef = useRef(null);

  const closeHoverAreaOverlay = useCallback(() => {
    if (hoverAreaOverlayRef.current) {
      hoverAreaOverlayRef.current.setMap(null);
      hoverAreaOverlayRef.current = null;
    }
  }, []);

  const closeActiveAreaOverlay = useCallback(() => {
    if (activeAreaOverlayRef.current) {
      activeAreaOverlayRef.current.setMap(null);
      activeAreaOverlayRef.current = null;
    }

    activeAreaCodeRef.current = null;
  }, []);

  const clearPolygons = useCallback(() => {
    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });

    polygonsRef.current = [];
    closeActiveAreaOverlay();
    closeHoverAreaOverlay();
  }, [closeActiveAreaOverlay, closeHoverAreaOverlay]);

  useEffect(() => {
    const map = mapRef.current;

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
        zIndex: 9000,
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
          fillOpacity: polygonOpacity.fillOpacity,
        });

        infoOverlay.setMap(null);

        if (hoverAreaOverlayRef.current === infoOverlay) {
          hoverAreaOverlayRef.current = null;
        }
      });

      window.kakao.maps.event.addListener(polygon, "click", (mouseEvent) => {
        if (activeAreaCodeRef.current === areaCode) {
          closeActiveAreaOverlay();
          return;
        }

        closeActiveAreaOverlay();
        closeHospitalOverlay?.();

        infoOverlay.setPosition(mouseEvent.latLng);
        infoOverlay.setMap(map);

        activeAreaOverlayRef.current = infoOverlay;
        activeAreaCodeRef.current = areaCode;

        map.panTo(mouseEvent.latLng);
        map.setLevel(AREA_CLICK_ZOOM_LEVEL, {
          anchor: mouseEvent.latLng,
        });
      });

      polygonsRef.current.push(polygon);
    });

    return clearPolygons;
  }, [
    mapRef,
    areaCongestions,
    polygonOpacity.fillOpacity,
    polygonOpacity.strokeOpacity,
    shouldRenderPolygons,
    closeHospitalOverlay,
    clearPolygons,
    closeActiveAreaOverlay,
  ]);

  return {
    clearPolygons,
    closeActiveAreaOverlay,
    closeHoverAreaOverlay,
  };
}
