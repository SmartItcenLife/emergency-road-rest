package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.*;
import com.itcen.emergencyroad.map.entity.MapArea;
import com.itcen.emergencyroad.map.enums.*;
import com.itcen.emergencyroad.map.repository.MapAreaRepository;
import com.itcen.emergencyroad.map.repository.MapHospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapService {
    private final MapHospitalRepository mapHospitalRepository;
    private final MapAreaRepository mapAreaRepository;

    public List<MapHospitalMarkerResponseDto> getHospitals(
            MapCategory category,
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        return switch (category) {
            case GENERAL -> getGeneralHospitals(swLat, swLon, neLat, neLon);
            case PEDIATRIC -> getPediatricHospitals(swLat, swLon, neLat, neLon);
            case PREGNANT -> getPregnantHospitals(swLat, swLon, neLat, neLon);
        };
    }

    private List<MapHospitalMarkerResponseDto> getGeneralHospitals(
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        List<MapGeneralHospitalMarkerProjection> hospitals; // 필요한 데이터만 끌고 오기위해 projection 사용

        // 영역 설정
        if ( hasBounds(swLat, swLon, neLat, neLon)) {
            Bounds bounds = normalizeBounds(swLat, swLon, neLat, neLon);

            hospitals = mapHospitalRepository.findGeneralHospitalMarkersInBounds(
                    bounds.minLat(),
                    bounds.minLon(),
                    bounds.maxLat(),
                    bounds.maxLon()
            );
        } else { // 사용자 영역이 없는 경우 현재는 기본적으로 좌표가 있는 모든 병원 목록을 조회한다.
            hospitals = mapHospitalRepository.findGeneralHospitalMarkers();
        }

        return hospitals.stream()
                .map(hospital -> this.toMarkerResponse(hospital))
                .toList();
    }

    private List<MapHospitalMarkerResponseDto> getPediatricHospitals(
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        List<MapPediatricHospitalMarkerProjection> hospitals;

        if (hasBounds(swLat, swLon, neLat, neLon)) {
            Bounds bounds = normalizeBounds(swLat, swLon, neLat, neLon);

            hospitals = mapHospitalRepository.findPediatricHospitalMarkersInBounds(
                    bounds.minLat(),
                    bounds.minLon(),
                    bounds.maxLat(),
                    bounds.maxLon()
            );
        } else {
            hospitals = mapHospitalRepository.findPediatricHospitalMarkers();
        }

        return hospitals.stream()
                .map(this::toMarkerResponse)
                .toList();
    }

    private List<MapHospitalMarkerResponseDto> getPregnantHospitals(
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        List<MapPregnantHospitalMarkerProjection> hospitals;

        if (hasBounds(swLat, swLon, neLat, neLon)) {
            Bounds bounds = normalizeBounds(swLat, swLon, neLat, neLon);

            hospitals = mapHospitalRepository.findPregnantHospitalMarkersInBounds(
                    bounds.minLat(),
                    bounds.minLon(),
                    bounds.maxLat(),
                    bounds.maxLon()
            );
        } else {
            hospitals = mapHospitalRepository.findPregnantHospitalMarkers();
        }

        return hospitals.stream()
                .map(this::toMarkerResponse)
                .toList();
    }

    private MapHospitalMarkerResponseDto toMarkerResponse(
            MapGeneralHospitalMarkerProjection hospital
    ) {
        return baseMarkerBuilder(hospital, MapCategory.GENERAL)
                .status(createEmergencyBedStatus(
                        hospital.getEmergencyAvailableBeds(),
                        hospital.getEmergencyTotalBeds()
                ))
                .build();
    }

    private MapHospitalMarkerResponseDto toMarkerResponse(
            MapPediatricHospitalMarkerProjection hospital
    ) {
        return baseMarkerBuilder(hospital, MapCategory.PEDIATRIC)
                .status(createResourceRateStatus(
                        MapMetricType.PEDIATRIC_BED,
                        hospital.getPediatricAvailableBeds(),
                        hospital.getPediatricTotalBeds()
                ))
                .build();
    }

    private MapHospitalMarkerResponseDto toMarkerResponse(
            MapPregnantHospitalMarkerProjection hospital
    ) {
        return baseMarkerBuilder(hospital, MapCategory.PREGNANT)
                .status(createPregnantStatus(
                        hospital.getNicuBedCount(),
                        hospital.getNicuStandard(),
                        hospital.getDeliveryAvailable()
                ))
                .build();
    }

    private MapHospitalMarkerResponseDto.MapHospitalMarkerResponseDtoBuilder baseMarkerBuilder(
            MapHospitalMarkerBaseProjection hospital,
            MapCategory category
    ) {
        return MapHospitalMarkerResponseDto.builder()
                .hpid(hospital.getHpid())
                .hospitalName(hospital.getHospitalName())
                .category(category)
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .address(hospital.getAddress())
                .emergencyPhone(hospital.getEmergencyPhone())
                .areaCode(null)
                .areaName(extractDistrictName(hospital.getAddress()))
                .recordedAt(hospital.getRecordedAt());
    }

    private boolean hasBounds(
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

    private Bounds normalizeBounds(
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        return new Bounds(
                Math.min(swLat, neLat),
                Math.min(swLon, neLon),
                Math.max(swLat, neLat),
                Math.max(swLon, neLon)
        );
    }

    private record Bounds(
            double minLat,
            double minLon,
            double maxLat,
            double maxLon
    ) {
    }

    private MapDisplayStatusDto createEmergencyBedStatus(
            Integer availableCount,
            Integer totalCount
    ) {
        if (availableCount == null || totalCount == null || totalCount == 0) {
            return MapDisplayStatusDto.builder()
                    .type(MapStatusType.SCORE)
                    .metricType(MapMetricType.EMERGENCY_BED)
                    .grade(MapCongestionGrade.UNKNOWN)
                    .label("정보없음")
                    .colorLevel(0)
                    .score(null)
                    .availableCount(availableCount)
                    .totalCount(totalCount)
                    .rate(null)
                    .build();
        }

        int rate = (int) Math.round(availableCount * 100.0 / totalCount);

        int cappedAvailable = Math.min(availableCount, 20); // 너무 높은 점수가 나오지 않도록 상한선 제한을 둠, 현재는 20개 이상은 여유있는 병원이라고 임의로 판단
        int availableScore = cappedAvailable * 5;   // 0 ~ 100

        int finalScore = (int) Math.round(availableScore * 0.7 + rate * 0.3);

        MapCongestionGrade grade;
        String label;
        int colorLevel;

        if (finalScore >= 70) {
            grade = MapCongestionGrade.RELAXED;
            label = "여유";
            colorLevel = 4;
        } else if (finalScore >= 40) {
            grade = MapCongestionGrade.NORMAL;
            label = "보통";
            colorLevel = 3;
        } else if (finalScore >= 15) {
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
                .metricType(MapMetricType.EMERGENCY_BED)
                .grade(grade)
                .label(label)
                .colorLevel(colorLevel)
                .score(finalScore)
                .availableCount(availableCount)
                .totalCount(totalCount)
                .rate(rate)
                .build();
    }

    private MapDisplayStatusDto createResourceRateStatus(
            MapMetricType metricType,
            Integer availableCount,
            Integer totalCount
    ) {
        if (availableCount == null || totalCount == null || totalCount == 0) {
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

        int rate = (int) Math.round(availableCount * 100.0 / totalCount);

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

    private MapDisplayStatusDto createPregnantStatus(
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

    // 구 별 혼잡도 계산 : 구 별 혼잡도를 확인하기 위해서 병원별 혼잡도를 기준으로 계산
    private MapDisplayStatusDto createAreaEmergencyBedStatus(
            Integer availableCount,
            Integer totalCount
    ) {
        if (availableCount == null || totalCount == null || totalCount == 0) {
            return MapDisplayStatusDto.builder()
                    .type(MapStatusType.SCORE)
                    .metricType(MapMetricType.EMERGENCY_BED)
                    .grade(MapCongestionGrade.UNKNOWN)
                    .label("정보없음")
                    .colorLevel(0)
                    .score(null)
                    .availableCount(availableCount)
                    .totalCount(totalCount)
                    .rate(null)
                    .build();
        }

        int rate = (int) Math.round(availableCount * 100.0 / totalCount);

        MapCongestionGrade grade;
        String label;
        int colorLevel;

        if (rate >= 30) {
            grade = MapCongestionGrade.RELAXED;
            label = "여유";
            colorLevel = 4;
        } else if (rate >= 15) {
            grade = MapCongestionGrade.NORMAL;
            label = "보통";
            colorLevel = 3;
        } else if (rate >= 5) {
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
                .metricType(MapMetricType.EMERGENCY_BED)
                .grade(grade)
                .label(label)
                .colorLevel(colorLevel)
                .score(rate)
                .availableCount(availableCount)
                .totalCount(totalCount)
                .rate(rate)
                .build();
    }

    // TODO : 나중에는 master table 의 컬럼값을 조절하던, hospital district mapping 테이블을 만들던하자.
    private String extractDistrictName(String address) {
        if (address == null || address.isBlank()) {
            return null;
        }

        String[] tokens = address.split(" ");

        for (String token : tokens) {
            if (token.endsWith("구")) {
                return token;
            }
        }

        return null;
    }
    // 구 별 혼잡도 조회 메인 메소드
    public List<MapAreaCongestionResponseDto> getAreaCongestion(MapCategory category) {
        if (category != MapCategory.GENERAL) {
            return List.of();
        }

        List<MapArea> areas = mapAreaRepository.findActiveAreasBySidoAndLevel(
                "11",
                MapAreaLevel.DISTRICT
        );

        List<MapAreaCongestionProjection> sources =
                mapHospitalRepository.findGeneralAreaCongestionSources();

        Map< String, List<MapAreaCongestionProjection> > hospitalsByDistrict =
                sources.stream()
                        .filter(source -> extractDistrictName(source.getAddress()) != null)
                        .collect(Collectors.groupingBy(
                                source -> extractDistrictName(source.getAddress())
                        ));
        return areas.stream()
                .map(area -> toAreaCongestionResponse(
                        area,
                        hospitalsByDistrict.getOrDefault(area.getAreaName(), List.of())
                ))
                .toList();
    }

    // 구별 응답 DTO 변환 메소드
    private MapAreaCongestionResponseDto toAreaCongestionResponse(
            MapArea area,
            List<MapAreaCongestionProjection> hospitals
    ) {
        int hospitalCount = hospitals.size();

        int totalAvailableBeds = hospitals.stream()
                .map(MapAreaCongestionProjection::getEmergencyAvailableBeds)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        int totalBeds = hospitals.stream()
                .map(MapAreaCongestionProjection::getEmergencyTotalBeds)
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
                .category(MapCategory.GENERAL)
//                .status(createEmergencyBedStatus(totalAvailableBeds, totalBeds)) -> 각 병원에서 혼잡도를 표현하기엔 적합하나 구 전체의 혼잡도를 표현하기엔 부적절
                .status(createAreaEmergencyBedStatus(totalAvailableBeds,totalBeds))
                .hospitalCount(hospitalCount)
                .recordedAt(recordedAt)
                .build();
    }
}
