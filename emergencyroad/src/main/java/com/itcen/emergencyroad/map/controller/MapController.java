package com.itcen.emergencyroad.map.controller;

import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.map.dto.MapAreaCongestionResponseDto;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/map")
public class MapController {

    private final MapService mapService;

    @GetMapping("/hospitals")
    public ApiResponseDto<List<MapHospitalMarkerResponseDto>> getHospitals(
            @RequestParam(defaultValue = "GENERAL") MapCategory category,
            @RequestParam(required = false) Double swLat,
            @RequestParam(required = false) Double swLon,
            @RequestParam(required = false) Double neLat,
            @RequestParam(required = false) Double neLon
    ) {
        List<MapHospitalMarkerResponseDto> hospitals =
                mapService.getHospitals(
                        category,
                        swLat,
                        swLon,
                        neLat,
                        neLon
                );

        return ApiResponseDto.success("지도 병원 마커 조회 성공", hospitals);
    }

    @GetMapping("/areas/congestion")
    public ApiResponseDto<List<MapAreaCongestionResponseDto>> getAreaCongestion(
            @RequestParam(defaultValue = "GENERAL") MapCategory category
    ) {
        List<MapAreaCongestionResponseDto> areas =
                mapService.getAreaCongestion(category);

        return ApiResponseDto.success("지도 구별 혼잡도 조회 성공", areas);
    }
}