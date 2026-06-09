package com.itcen.emergencyroad.map.service;

public record MapBounds(
        double minLat,
        double minLon,
        double maxLat,
        double maxLon
) {
    public static boolean hasBounds(
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        return swLat != null
                && swLon != null
                && neLat != null
                && neLon != null;
    }

    public static MapBounds of(
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        return new MapBounds(
                Math.min(swLat, neLat),
                Math.min(swLon, neLon),
                Math.max(swLat, neLat),
                Math.max(swLon, neLon)
        );
    }
}
