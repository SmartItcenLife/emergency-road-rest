package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.MapAreaCongestionProjection;
import com.itcen.emergencyroad.map.dto.MapAreaCongestionResponseDto;
import com.itcen.emergencyroad.map.entity.MapArea;
import com.itcen.emergencyroad.map.enums.MapAreaLevel;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.enums.MapMetricType;
import com.itcen.emergencyroad.map.repository.MapAreaRepository;
import com.itcen.emergencyroad.map.repository.MapHospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapAreaCongestionService {
    private static final long AREA_CONGESTION_CACHE_TTL_MILLIS = 60_000L;
    private static final String DEFAULT_SIDO_CODE = "11";

    private final MapHospitalRepository mapHospitalRepository;
    private final MapAreaRepository mapAreaRepository;
    private final MapStatusCalculator statusCalculator;
    private final MapDistrictResolver districtResolver;

    private final Map<String, CachedAreaCongestion> areaCongestionCache =
            new ConcurrentHashMap<>();

    public List<MapAreaCongestionResponseDto> getAreaCongestion(
            MapCategory category,
            String sidoCode
    ) {
        long startTime = System.nanoTime();
        long now = System.currentTimeMillis();
        String normalizedSidoCode = normalizeSidoCode(sidoCode);
        String cacheKey = buildAreaCongestionCacheKey(category, normalizedSidoCode);

        CachedAreaCongestion cached = areaCongestionCache.get(cacheKey);

        if (cached != null && now - cached.cachedAt() < AREA_CONGESTION_CACHE_TTL_MILLIS) {
            double elapsedMs = (System.nanoTime() - startTime) / 1_000_000.0;
            System.out.printf(
                    "[MAP AREA CONGESTION][AFTER][CACHE] %s key=%s: %.2fms%n",
                    category,
                    cacheKey,
                    elapsedMs
            );

            return cached.data();
        }

        List<MapArea> areas = mapAreaRepository.findActiveAreasBySidoAndLevel(
                normalizedSidoCode,
                MapAreaLevel.DISTRICT
        );

        List<MapAreaCongestionProjection> sources = getAreaCongestionSources(category);

        Map<String, List<MapAreaCongestionProjection>> hospitalsByDistrict =
                sources.stream()
                        .filter(source -> districtResolver.extractDistrictName(source.getAddress()) != null)
                        .collect(Collectors.groupingBy(
                                source -> districtResolver.extractDistrictName(source.getAddress())
                        ));

        List<MapAreaCongestionResponseDto> result = areas.stream()
                .map(area -> toAreaCongestionResponse(
                        category,
                        area,
                        hospitalsByDistrict.getOrDefault(area.getAreaName(), List.of())
                ))
                .toList();

        areaCongestionCache.put(cacheKey, new CachedAreaCongestion(result, now));

        double elapsedMs = (System.nanoTime() - startTime) / 1_000_000.0;
        System.out.printf(
                "[MAP AREA CONGESTION][AFTER][DB] %s key=%s: %.2fms%n",
                category,
                cacheKey,
                elapsedMs
        );

        return result;
    }

    private List<MapAreaCongestionProjection> getAreaCongestionSources(MapCategory category) {
        return switch (category) {
            case GENERAL -> mapHospitalRepository.findGeneralAreaCongestionSources();
            case PEDIATRIC -> mapHospitalRepository.findPediatricAreaCongestionSources();
            case PREGNANT -> mapHospitalRepository.findPregnantAreaCongestionSources();
        };
    }

    private MapAreaCongestionResponseDto toAreaCongestionResponse(
            MapCategory category,
            MapArea area,
            List<MapAreaCongestionProjection> hospitals
    ) {
        int hospitalCount = hospitals.size();

        int totalAvailableBeds = hospitals.stream()
                .map(MapAreaCongestionProjection::getAvailableCount)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        int totalBeds = hospitals.stream()
                .map(MapAreaCongestionProjection::getTotalCount)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        LocalDateTime recordedAt = hospitals.stream()
                .map(MapAreaCongestionProjection::getRecordedAt)
                .filter(Objects::nonNull)
                .max(LocalDateTime::compareTo)
                .orElse(null);

        return MapAreaCongestionResponseDto.builder()
                .areaCode(area.getAreaCode())
                .areaName(area.getAreaName())
                .areaLevel(area.getAreaLevel())
                .category(category)
                .status(statusCalculator.createAreaResourceStatus(
                        getAreaMetricType(category),
                        totalAvailableBeds,
                        totalBeds,
                        hospitalCount
                ))
                .hospitalCount(hospitalCount)
                .recordedAt(recordedAt)
                .build();
    }

    private MapMetricType getAreaMetricType(MapCategory category) {
        return switch (category) {
            case GENERAL -> MapMetricType.EMERGENCY_BED;
            case PEDIATRIC -> MapMetricType.PEDIATRIC_BED;
            case PREGNANT -> MapMetricType.NICU;
        };
    }

    private String normalizeSidoCode(String sidoCode) {
        if (sidoCode == null || sidoCode.isBlank()) {
            return DEFAULT_SIDO_CODE;
        }

        return sidoCode.trim();
    }

    private String buildAreaCongestionCacheKey(
            MapCategory category,
            String sidoCode
    ) {
        return category + ":" + sidoCode;
    }

    private record CachedAreaCongestion(
            List<MapAreaCongestionResponseDto> data,
            long cachedAt
    ) {
    }
}
