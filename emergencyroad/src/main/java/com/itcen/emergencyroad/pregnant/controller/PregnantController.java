package com.itcen.emergencyroad.pregnant.controller;

import com.itcen.emergencyroad.findpath.service.KakaoLocalApiClient;
import com.itcen.emergencyroad.pregnant.dto.PregnantHospitalDetailDto;
import com.itcen.emergencyroad.pregnant.dto.PregnantHospitalListDto;
import com.itcen.emergencyroad.pregnant.dto.PregnantHospitalListResponseDto;
import com.itcen.emergencyroad.pregnant.service.PregnantViewService;
import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.recommend.entity.HospitalSortType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hospitals/pregnant")
public class PregnantController {

    private final PregnantViewService pregnantViewService;
    private final KakaoLocalApiClient kakaoLocalApiClient;

    @GetMapping
    public ApiResponseDto<PregnantHospitalListResponseDto> hospitalList(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false, defaultValue = "SCORE") String sort
    ) {
        double baseLat = (lat != null && lat != 0.0) ? lat : 37.5665;
        double baseLon = (lon != null && lon != 0.0) ? lon : 126.9780;

        HospitalSortType sortType = HospitalSortType.from(sort);

        List<PregnantHospitalListDto> hospitals =
                pregnantViewService.getPregnantHospitalList(baseLat, baseLon, sortType);

        String displayLocation = kakaoLocalApiClient.getDisplayLocation(baseLat, baseLon);

        PregnantHospitalListResponseDto response =
                PregnantHospitalListResponseDto.builder()
                        .hospitals(hospitals)
                        .locationProvided(lat != null && lon != null)
                        .displayLocation(displayLocation)
                        .userLat(baseLat)
                        .userLon(baseLon)
                        .sort(sortType.name())
                        .build();

        return ApiResponseDto.success("임산부 병원 목록 조회 성공", response);
    }

    @GetMapping("/{hpid}/detail")
    public ApiResponseDto<PregnantHospitalDetailDto> getHospitalDetail(@PathVariable String hpid) {
        PregnantHospitalDetailDto detail =
                pregnantViewService.findPregnantRealtimeByHospital(hpid);
        return ApiResponseDto.success("임산부 병원 상세 조회 성공", detail);
    }
}
