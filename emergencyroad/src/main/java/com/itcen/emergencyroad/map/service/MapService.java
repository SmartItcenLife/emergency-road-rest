package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.MapDisplayStatusDto;
import com.itcen.emergencyroad.map.dto.MapGeneralHospitalMarkerProjection;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.enums.MapCongestionGrade;
import com.itcen.emergencyroad.map.enums.MapMetricType;
import com.itcen.emergencyroad.map.enums.MapStatusType;
import com.itcen.emergencyroad.map.repository.MapHospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MapService {
    private final MapHospitalRepository mapHospitalRepository;

    public List<MapHospitalMarkerResponseDto> getHospitals(
            MapCategory category,
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        validateGeneralCategory(category); // 유효한 유형인지 검사

        List<MapGeneralHospitalMarkerProjection> hospitals; // 필요한 데이터만 끌고 오기위해 projection 사용

        // 영역 설정
        if ( hasBounds(swLat, swLon, neLat, neLon)) {
            double minLat = Math.min(swLat, neLat);
            double maxLat = Math.max(swLat, neLat);
            double minLon = Math.min(swLon, neLon);
            double maxLon = Math.max(swLon, neLon);

            hospitals = mapHospitalRepository.findGeneralHospitalMarkersInBounds(
                    minLat,
                    minLon,
                    maxLat,
                    maxLon
            );
        } else { // 사용자 영역이 없는 경우 현재는 기본적으로 좌표가 있는 모든 병원 목록을 조회한다.
            hospitals = mapHospitalRepository.findGeneralHospitalMarkers();
        }

        return hospitals.stream()
                .map(hospital -> this.toMarkerResponse(hospital))
                .toList();
    }

    private MapHospitalMarkerResponseDto toMarkerResponse(
            MapGeneralHospitalMarkerProjection hospital
    ) {
        return MapHospitalMarkerResponseDto.builder()
                .hpid(hospital.getHpid())
                .hospitalName(hospital.getHospitalName())
                .category(MapCategory.GENERAL)
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .address(hospital.getAddress())
                .emergencyPhone(hospital.getEmergencyPhone())
                .areaCode(null)
                .areaName(extractDistrictName(hospital.getAddress()))
                .status(createEmergencyBedStatus(
                        hospital.getEmergencyAvailableBeds(),
                        hospital.getEmergencyTotalBeds()
                ))
                .updatedAt(hospital.getRecordedAt())
                .build();
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

    private void validateGeneralCategory(MapCategory category) {
        if (category != MapCategory.GENERAL) {
            throw new IllegalArgumentException("현재 지도 병원 마커 API는 GENERAL만 지원합니다. category=" + category);
        }
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
}
