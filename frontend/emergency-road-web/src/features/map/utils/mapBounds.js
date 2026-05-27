export function getMapBoundsParams(map) {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    return {
          swLat: sw.getLat(),
          swLon: sw.getLng(),
          neLat: ne.getLat(),
          neLon: ne.getLng(),
        };
}