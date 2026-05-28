package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.MapAreaCongestionResponseDto;
import com.itcen.emergencyroad.map.dto.MapDisplayStatusDto;
import com.itcen.emergencyroad.map.dto.MapGeneralHospitalDetailDto;
import com.itcen.emergencyroad.map.dto.MapHospitalDetailResponseDto;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapAreaLevel;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.enums.MapCongestionGrade;
import com.itcen.emergencyroad.map.enums.MapMetricType;
import com.itcen.emergencyroad.map.enums.MapStatusType;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MapMockService {

    // Mock API 응답의 갱신 시간을 일정하게 유지해 프론트에서 같은 응답 구조를 반복 검증하기 위한 기준 시간
    private static final LocalDateTime MOCK_UPDATED_AT =
            LocalDateTime.of(2026, 5, 26, 10, 0);

    // 지도 Polygon 표현에 필요한 구/동 단위 혼잡도 Mock 데이터를 반환하기 위한 메서드
    public List<MapAreaCongestionResponseDto> getAreas(
            MapCategory category,
            MapAreaLevel level,
            String districtCode
    ) {
        validateGeneralCategory(category);

        if (level == MapAreaLevel.DISTRICT) {
            return getGeneralDistrictAreas();
        }

        if (level == MapAreaLevel.DONG) {
            return getGeneralDongAreas(districtCode);
        }

        throw new IllegalArgumentException("지원하지 않는 지도 영역 레벨입니다. level=" + level);
    }

    // 지도 확대 후 병원 마커를 표시하는 데 필요한 최소 병원 정보를 반환하기 위한 메서드
    public List<MapHospitalMarkerResponseDto> getHospitals(MapCategory category) {
        validateGeneralCategory(category);

        return List.of(
                MapHospitalMarkerResponseDto.builder()
                        .hpid("A110001")
                        .hospitalName("서울중앙응급의료센터")
                        .category(MapCategory.GENERAL)
                        .latitude(37.5665)
                        .longitude(126.9780)
                        .address("서울특별시 중구 세종대로 110")
                        .emergencyPhone("02-1111-1119")
                        .areaCode("11140")
                        .areaName("중구")
                        .status(createEmergencyBedStatus(12, 20))
                        .recordedAt(MOCK_UPDATED_AT)
                        .build(),
                MapHospitalMarkerResponseDto.builder()
                        .hpid("A110002")
                        .hospitalName("강남응급병원")
                        .category(MapCategory.GENERAL)
                        .latitude(37.5172)
                        .longitude(127.0473)
                        .address("서울특별시 강남구 학동로 426")
                        .emergencyPhone("02-2222-1119")
                        .areaCode("11680")
                        .areaName("강남구")
                        .status(createEmergencyBedStatus(5, 25))
                        .recordedAt(MOCK_UPDATED_AT)
                        .build(),
                MapHospitalMarkerResponseDto.builder()
                        .hpid("A110003")
                        .hospitalName("종로응급의료센터")
                        .category(MapCategory.GENERAL)
                        .latitude(37.5729)
                        .longitude(126.9794)
                        .address("서울특별시 종로구 종로 1")
                        .emergencyPhone("02-3333-1119")
                        .areaCode("11110")
                        .areaName("종로구")
                        .status(createEmergencyBedStatus(1, 10))
                        .recordedAt(MOCK_UPDATED_AT)
                        .build()
        );
    }

    // 마커 클릭 시 사이드 패널에 표시할 공통 상세 정보와 General 전용 상세 정보를 조립하기 위한 메서드
    public MapHospitalDetailResponseDto getHospitalDetail(
            String hpid,
            MapCategory category
    ) {
        validateGeneralCategory(category);

        if ("A110001".equals(hpid)) {
            return MapHospitalDetailResponseDto.builder()
                    .hpid("A110001")
                    .hospitalName("서울중앙응급의료센터")
                    .category(MapCategory.GENERAL)
                    .address("서울특별시 중구 세종대로 110")
                    .phone("02-1111-0000")
                    .emergencyPhone("02-1111-1119")
                    .latitude(37.5665)
                    .longitude(126.9780)
                    .areaCode("11140")
                    .areaName("중구")
                    .status(createEmergencyBedStatus(12, 20))
                    .generalDetail(createGeneralDetail(12, 20, 3, 8))
                    .updatedAt(MOCK_UPDATED_AT)
                    .build();
        }

        if ("A110002".equals(hpid)) {
            return MapHospitalDetailResponseDto.builder()
                    .hpid("A110002")
                    .hospitalName("강남응급병원")
                    .category(MapCategory.GENERAL)
                    .address("서울특별시 강남구 학동로 426")
                    .phone("02-2222-0000")
                    .emergencyPhone("02-2222-1119")
                    .latitude(37.5172)
                    .longitude(127.0473)
                    .areaCode("11680")
                    .areaName("강남구")
                    .status(createEmergencyBedStatus(5, 25))
                    .generalDetail(createGeneralDetail(5, 25, 1, 10))
                    .updatedAt(MOCK_UPDATED_AT)
                    .build();
        }

        if ("A110003".equals(hpid)) {
            return MapHospitalDetailResponseDto.builder()
                    .hpid("A110003")
                    .hospitalName("종로응급의료센터")
                    .category(MapCategory.GENERAL)
                    .address("서울특별시 종로구 종로 1")
                    .phone("02-3333-0000")
                    .emergencyPhone("02-3333-1119")
                    .latitude(37.5729)
                    .longitude(126.9794)
                    .areaCode("11110")
                    .areaName("종로구")
                    .status(createEmergencyBedStatus(1, 10))
                    .generalDetail(createGeneralDetail(1, 10, 0, 4))
                    .updatedAt(MOCK_UPDATED_AT)
                    .build();
        }

        throw new IllegalArgumentException("Mock 병원 상세 정보가 없습니다. hpid=" + hpid);
    }

    // 현재 이슈 범위를 General Mock API로 제한해 지원하지 않는 유형이 조용히 잘못 응답되는 것을 막기 위한 검증
    private void validateGeneralCategory(MapCategory category) {
        if (category != MapCategory.GENERAL) {
            throw new IllegalArgumentException("Mock API는 현재 GENERAL만 지원합니다. category=" + category);
        }
    }

    // 서울 전체 구 단위 Polygon 색상 표현을 먼저 테스트하기 위한 General 구 단위 Mock 데이터
    private List<MapAreaCongestionResponseDto> getGeneralDistrictAreas() {
        return List.of(
                createArea("11110", "종로구", MapAreaLevel.DISTRICT, 2, 1, 10),
                createArea("11140", "중구", MapAreaLevel.DISTRICT, 3, 12, 20),
                createArea("11680", "강남구", MapAreaLevel.DISTRICT, 4, 5, 25)
        );
    }

    // 줌인 이후 특정 구의 동 단위 Polygon 색상 표현을 테스트하기 위한 General 동 단위 Mock 데이터
    private List<MapAreaCongestionResponseDto> getGeneralDongAreas(String districtCode) {
        if (!"11680".equals(districtCode)) {
            return List.of();
        }

        return List.of(
                createArea("11680101", "역삼동", MapAreaLevel.DONG, 2, 3, 10),
                createArea("11680105", "삼성동", MapAreaLevel.DONG, 1, 5, 8),
                createArea("11680108", "논현동", MapAreaLevel.DONG, 1, 1, 7)
        );
    }

    // 지역 응답 생성 코드를 한 곳에 모아 구/동 Mock 데이터의 응답 구조를 동일하게 유지하기 위한 helper
    private MapAreaCongestionResponseDto createArea(
            String areaCode,
            String areaName,
            MapAreaLevel level,
            Integer hospitalCount,
            Integer availableCount,
            Integer totalCount
    ) {
        return MapAreaCongestionResponseDto.builder()
                .areaCode(areaCode)
                .areaName(areaName)
                .areaLevel(level)
                .category(MapCategory.GENERAL)
                .status(createEmergencyBedStatus(availableCount, totalCount))
                .hospitalCount(hospitalCount)
                .updatedAt(MOCK_UPDATED_AT)
                .build();
    }

    // General 상세 패널에 필요한 응급실/중환자실/장비/중증질환 테스트 mock 데이터
    private MapGeneralHospitalDetailDto createGeneralDetail(
            Integer emergencyAvailableBeds,
            Integer emergencyTotalBeds,
            Integer icuAvailableBeds,
            Integer icuTotalBeds
    ) {
        return MapGeneralHospitalDetailDto.builder()
                .emergencyAvailableBeds(emergencyAvailableBeds)
                .emergencyTotalBeds(emergencyTotalBeds)
                .icuAvailableBeds(icuAvailableBeds)
                .icuTotalBeds(icuTotalBeds)
                .neuroIcuAvailableBeds(1)
                .neuroIcuTotalBeds("3")
                .chestIcuAvailableBeds(1)
                .chestIcuTotalBeds(2)
                .ctAvailable("Y")
                .mriAvailable("Y")
                .ventilatorAvailable("Y")
                .crrtAvailable("N")
                .ecmoAvailable("N")
                .angioAvailable("Y")
                .myocardialInfarctionAvailable("Y")
                .cerebralInfarctionAvailable("Y")
                .subarachnoidHemorrhageAvailable("N")
                .otherHemorrhageAvailable("Y")
                .aorticChestAvailable("N")
                .aorticAbdomenAvailable("N")
                .dialysisAvailable("Y")
                .closedWardAvailable("N")
                .endoscopyGiAvailable("Y")
                .endoscopyBronchialAvailable("N")
                .severeBurnsAvailable("N")
                .angioAdultAvailable("Y")
                .build();
    }

    // 응급실 가용 병상 수를 지도 색상/라벨/등급으로 변환
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
        MapCongestionGrade grade;
        String label;
        int colorLevel;

        if (rate >= 50) {
            grade = MapCongestionGrade.RELAXED;
            label = "여유";
            colorLevel = 3;
        } else if (rate >= 20) {
            grade = MapCongestionGrade.NORMAL;
            label = "보통";
            colorLevel = 2;
        } else {
            grade = MapCongestionGrade.CROWDED;
            label = "혼잡";
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
}
