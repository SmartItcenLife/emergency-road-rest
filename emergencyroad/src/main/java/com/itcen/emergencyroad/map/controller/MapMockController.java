package com.itcen.emergencyroad.map.controller;

import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.map.dto.MapAreaCongestionResponseDto;
import com.itcen.emergencyroad.map.dto.MapHospitalDetailResponseDto;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapAreaLevel;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.service.MapMockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/map/mock")
public class MapMockController {

    private final MapMockService mapMockService;

    // 서울 구/동 Polygon 색상 표현에 필요한 지역 단위 혼잡도 Mock 데이터를 제공하기 위한 API
    @GetMapping("/areas")
    public ApiResponseDto<List<MapAreaCongestionResponseDto>> getAreas(
            @RequestParam(defaultValue = "GENERAL") MapCategory category,
            @RequestParam(defaultValue = "DISTRICT") MapAreaLevel level,
            @RequestParam(required = false) String districtCode
    ) {
        List<MapAreaCongestionResponseDto> areas =
                mapMockService.getAreas(category, level, districtCode);

        return ApiResponseDto.success("지도 지역 혼잡도 Mock 조회 성공", areas);
    }

    // 지도 확대 시 병원 마커 표시에 필요한 병원 목록 Mock 데이터를 제공하기 위한 API
    @GetMapping("/hospitals")
    public ApiResponseDto<List<MapHospitalMarkerResponseDto>> getHospitals(
            @RequestParam(defaultValue = "GENERAL") MapCategory category
    ) {
        List<MapHospitalMarkerResponseDto> hospitals =
                mapMockService.getHospitals(category);

        return ApiResponseDto.success("지도 병원 마커 Mock 조회 성공", hospitals);
    }

    // 병원 마커 클릭 시 상세 패널에 표시할 병원 상세 Mock 데이터를 제공하기 위한 API
    @GetMapping("/hospitals/{hpid}")
    public ApiResponseDto<MapHospitalDetailResponseDto> getHospitalDetail(
            @PathVariable String hpid,
            @RequestParam(defaultValue = "GENERAL") MapCategory category
    ) {
        MapHospitalDetailResponseDto detail =
                mapMockService.getHospitalDetail(hpid, category);

        return ApiResponseDto.success("지도 병원 상세 Mock 조회 성공", detail);
    }
}
