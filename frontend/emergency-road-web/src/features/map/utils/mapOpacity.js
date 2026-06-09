function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

export function getPolygonOpacityByLevel(level) {
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
  
export function getMarkerOpacityByLevel(level) {
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