package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.service.strategy.MapHospitalMarkerStrategy;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MapHospitalMarkerService {
    private static final long HOSPITAL_MARKER_CACHE_TTL_MILLIS = 10_000L;

    private final Map<MapCategory, MapHospitalMarkerStrategy> strategies;
    private final Map<String, CachedHospitalMarkers> hospitalMarkerCache =
            new ConcurrentHashMap<>();

    public MapHospitalMarkerService(List<MapHospitalMarkerStrategy> strategies) {
        this.strategies = new EnumMap<>(MapCategory.class);
        strategies.forEach(strategy -> this.strategies.put(strategy.getCategory(), strategy));
    }

    public List<MapHospitalMarkerResponseDto> getHospitals(
            MapCategory category,
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        long startTime = System.nanoTime();
        long now = System.currentTimeMillis();
        MapBounds bounds = MapBounds.hasBounds(swLat, swLon, neLat, neLon)
                ? MapBounds.of(swLat, swLon, neLat, neLon)
                : null;
        String cacheKey = buildHospitalMarkerCacheKey(category, bounds);

        CachedHospitalMarkers cached = hospitalMarkerCache.get(cacheKey);

        if (cached != null && now - cached.cachedAt() < HOSPITAL_MARKER_CACHE_TTL_MILLIS) {
            double elapsedMs = (System.nanoTime() - startTime) / 1_000_000.0;
            System.out.printf(
                    "[MAP HOSPITAL MARKERS][AFTER][CACHE] %s key=%s count=%d: %.2fms%n",
                    category,
                    cacheKey,
                    cached.data().size(),
                    elapsedMs
            );

            return cached.data();
        }

        MapHospitalMarkerStrategy strategy = strategies.get(category);

        if (strategy == null) {
            throw new IllegalArgumentException("지원하지 않는 지도 병원 유형입니다: " + category);
        }

        List<MapHospitalMarkerResponseDto> result = strategy.getHospitals(bounds);

        hospitalMarkerCache.put(cacheKey, new CachedHospitalMarkers(result, now));

        double elapsedMs = (System.nanoTime() - startTime) / 1_000_000.0;
        System.out.printf(
                "[MAP HOSPITAL MARKERS][AFTER][DB] %s key=%s bounds=%s count=%d: %.2fms%n",
                category,
                cacheKey,
                bounds != null,
                result.size(),
                elapsedMs
        );

        return result;
    }

    private String buildHospitalMarkerCacheKey(
            MapCategory category,
            MapBounds bounds
    ) {
        if (bounds == null) {
            return category + ":ALL";
        }

        return String.format(
                "%s:%.3f:%.3f:%.3f:%.3f",
                category,
                bounds.minLat(),
                bounds.minLon(),
                bounds.maxLat(),
                bounds.maxLon()
        );
    }

    private record CachedHospitalMarkers(
            List<MapHospitalMarkerResponseDto> data,
            long cachedAt
    ) {
    }
}
