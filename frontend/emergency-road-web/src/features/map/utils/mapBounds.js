export function getMapBoundsParams(map) {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    return {
        swLat: sw.getLat(),
        swLng: sw.getLng(),
        neLat: ne.getLat(),
        neLng: ne.getLng(),
    };
}