package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.MapDisplayStatusDto;
import com.itcen.emergencyroad.map.enums.MapCongestionGrade;
import com.itcen.emergencyroad.map.enums.MapMetricType;
import com.itcen.emergencyroad.map.enums.MapStatusType;
import org.springframework.stereotype.Component;

@Component
public class MapStatusCalculator {

    public MapDisplayStatusDto createEmergencyBedStatus(
            Integer availableCount,
            Integer totalCount
    ) {
        if (availableCount == null || totalCount == null || totalCount == 0) {
            return unknownScoreStatus(MapMetricType.EMERGENCY_BED, availableCount, totalCount);
        }

        int rate = calculateRate(availableCount, totalCount);
        int cappedAvailable = Math.min(availableCount, 20);
        int availableScore = cappedAvailable * 5;
        int finalScore = (int) Math.round(availableScore * 0.7 + rate * 0.3);

        return scoreStatus(
                MapMetricType.EMERGENCY_BED,
                finalScore,
                rate,
                availableCount,
                totalCount
        );
    }

    public MapDisplayStatusDto createResourceRateStatus(
            MapMetricType metricType,
            Integer availableCount,
            Integer totalCount
    ) {
        if (availableCount == null || totalCount == null || totalCount == 0) {
            return unknownScoreStatus(metricType, availableCount, totalCount);
        }

        int rate = calculateRate(availableCount, totalCount);

        MapCongestionGrade grade;
        String label;
        int colorLevel;

        if (rate >= 50) {
            grade = MapCongestionGrade.RELAXED;
            label = "여유";
            colorLevel = 4;
        } else if (rate >= 20) {
            grade = MapCongestionGrade.NORMAL;
            label = "보통";
            colorLevel = 3;
        } else {
            grade = MapCongestionGrade.CROWDED;
            label = "혼잡";
            colorLevel = 2;
        }

        return MapDisplayStatusDto.builder()
                .type(MapStatusType.SCORE)
                .metricType(metricType)
                .grade(grade)
                .label(label)
                .colorLevel(colorLevel)
                .score(rate)
                .availableCount(availableCount)
                .totalCount(totalCount)
                .rate(rate)
                .build();
    }

    public MapDisplayStatusDto createPediatricBedStatus(
            Integer availableCount,
            Integer totalCount
    ) {
        if (availableCount == null || totalCount == null || totalCount == 0) {
            return unknownScoreStatus(MapMetricType.PEDIATRIC_BED, availableCount, totalCount);
        }

        int rate = calculateRate(availableCount, totalCount);

        MapCongestionGrade grade;
        String label;
        int colorLevel;

        if (rate >= 60) {
            grade = MapCongestionGrade.RELAXED;
            label = "여유";
            colorLevel = 4;
        } else if (rate >= 25) {
            grade = MapCongestionGrade.CROWDED;
            label = "혼잡";
            colorLevel = 2;
        } else {
            grade = MapCongestionGrade.VERY_CROWDED;
            label = "매우혼잡";
            colorLevel = 1;
        }

        return MapDisplayStatusDto.builder()
                .type(MapStatusType.SCORE)
                .metricType(MapMetricType.PEDIATRIC_BED)
                .grade(grade)
                .label(label)
                .colorLevel(colorLevel)
                .score(rate)
                .availableCount(availableCount)
                .totalCount(totalCount)
                .rate(rate)
                .build();
    }

    public MapDisplayStatusDto createPregnantStatus(
            Integer nicuBedCount,
            Integer nicuStandard,
            String deliveryAvailable
    ) {
        String deliveryLabel = toAvailabilityLabel(deliveryAvailable);

        if ("가능".equals(deliveryLabel)) {
            return MapDisplayStatusDto.builder()
                    .type(MapStatusType.STATUS)
                    .metricType(MapMetricType.DELIVERY_ROOM)
                    .grade(MapCongestionGrade.RELAXED)
                    .label("분만 가능")
                    .colorLevel(4)
                    .score(null)
                    .availableCount(nicuBedCount)
                    .totalCount(nicuStandard)
                    .rate(null)
                    .build();
        }

        if ("불가".equals(deliveryLabel)) {
            return MapDisplayStatusDto.builder()
                    .type(MapStatusType.STATUS)
                    .metricType(MapMetricType.DELIVERY_ROOM)
                    .grade(MapCongestionGrade.CROWDED)
                    .label("분만 불가")
                    .colorLevel(2)
                    .score(null)
                    .availableCount(nicuBedCount)
                    .totalCount(nicuStandard)
                    .rate(null)
                    .build();
        }

        return createResourceRateStatus(
                MapMetricType.NICU,
                nicuBedCount,
                nicuStandard
        );
    }

    public MapDisplayStatusDto createAreaResourceStatus(
            MapMetricType metricType,
            Integer availableCount,
            Integer totalCount,
            Integer hospitalCount
    ) {
        if (availableCount == null || totalCount == null || totalCount == 0) {
            return unknownScoreStatus(metricType, availableCount, totalCount);
        }

        int rate = calculateRate(availableCount, totalCount);
        int validHospitalCount = hospitalCount == null || hospitalCount <= 0 ? 1 : hospitalCount;
        double averageAvailable = availableCount / (double) validHospitalCount;
        int averageAvailableScore = (int) Math.round(
                Math.min(averageAvailable, getAreaAverageAvailableCap(metricType))
                        / getAreaAverageAvailableCap(metricType)
                        * 100
        );
        int finalScore = (int) Math.round(rate * 0.7 + averageAvailableScore * 0.3);

        return scoreStatus(
                metricType,
                finalScore,
                rate,
                availableCount,
                totalCount
        );
    }

    private MapDisplayStatusDto scoreStatus(
            MapMetricType metricType,
            int score,
            int rate,
            Integer availableCount,
            Integer totalCount
    ) {
        MapCongestionGrade grade;
        String label;
        int colorLevel;

        if (score >= 70) {
            grade = MapCongestionGrade.RELAXED;
            label = "여유";
            colorLevel = 4;
        } else if (score >= 40) {
            grade = MapCongestionGrade.NORMAL;
            label = "보통";
            colorLevel = 3;
        } else if (score >= 15) {
            grade = MapCongestionGrade.CROWDED;
            label = "혼잡";
            colorLevel = 2;
        } else {
            grade = MapCongestionGrade.VERY_CROWDED;
            label = "매우 혼잡";
            colorLevel = 1;
        }

        return MapDisplayStatusDto.builder()
                .type(MapStatusType.SCORE)
                .metricType(metricType)
                .grade(grade)
                .label(label)
                .colorLevel(colorLevel)
                .score(score)
                .availableCount(availableCount)
                .totalCount(totalCount)
                .rate(rate)
                .build();
    }

    private MapDisplayStatusDto unknownScoreStatus(
            MapMetricType metricType,
            Integer availableCount,
            Integer totalCount
    ) {
        return MapDisplayStatusDto.builder()
                .type(MapStatusType.SCORE)
                .metricType(metricType)
                .grade(MapCongestionGrade.UNKNOWN)
                .label("정보없음")
                .colorLevel(0)
                .score(null)
                .availableCount(availableCount)
                .totalCount(totalCount)
                .rate(null)
                .build();
    }

    private int calculateRate(Integer availableCount, Integer totalCount) {
        return (int) Math.round(availableCount * 100.0 / totalCount);
    }

    private int getAreaAverageAvailableCap(MapMetricType metricType) {
        return switch (metricType) {
            case EMERGENCY_BED -> 20;
            case PEDIATRIC_BED -> 5;
            case NICU -> 3;
            case DELIVERY_ROOM -> 1;
        };
    }

    private String toAvailabilityLabel(String value) {
        if (value == null || value.isBlank()) {
            return "정보없음";
        }

        String normalized = value.trim();

        if ("Y".equalsIgnoreCase(normalized) || "Y1".equalsIgnoreCase(normalized)) {
            return "가능";
        }

        if ("N".equalsIgnoreCase(normalized) || "N1".equalsIgnoreCase(normalized)) {
            return "불가";
        }

        return normalized;
    }
}
