package com.itcen.emergencyroad.general.controller;

import com.itcen.emergencyroad.findpath.service.KakaoLocalApiClient;
import com.itcen.emergencyroad.general.dto.GeneralHospitalDetailDto;
import com.itcen.emergencyroad.general.dto.GeneralHospitalListDto;
import com.itcen.emergencyroad.general.dto.GeneralHospitalListResponseDto;
import com.itcen.emergencyroad.general.service.GeneralViewService;
import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.recommend.entity.HospitalSortType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hospitals/general")
public class GeneralController {
    private final GeneralViewService generalViewService;
    private final KakaoLocalApiClient kakaoLocalApiClient;

    @GetMapping("/{hpid}/detail")
    public ApiResponseDto<GeneralHospitalDetailDto> getHospitalDetail(@PathVariable String hpid) {
        GeneralHospitalDetailDto detail =
                generalViewService.getGeneralHospitalDetail(hpid);
        return ApiResponseDto.success("일반 병원 상세 조회 성공", detail);
    }

    @GetMapping
    public ApiResponseDto<GeneralHospitalListResponseDto> hospitalList(@RequestParam(required = false) Double lat,
                               @RequestParam(required = false) Double lon,
                               @RequestParam(required = false, defaultValue = "SCORE") String sort
                               ) {

        double baseLat = (lat != null && lat != 0.0) ? lat : 37.5665;
        double baseLon = (lon != null && lon != 0.0) ? lon : 126.9780;

        HospitalSortType sortType = HospitalSortType.from(sort);

        List<GeneralHospitalListDto> hospitals = generalViewService.getGeneralHospitalList(baseLat, baseLon, sortType);

        String displayLocation =
                kakaoLocalApiClient.getDisplayLocation(baseLat, baseLon);

        GeneralHospitalListResponseDto response =
                GeneralHospitalListResponseDto.builder()
                        .hospitals(hospitals)
                        .locationProvided(lat != null && lon != null)
                        .displayLocation(displayLocation)
                        .userLat(baseLat)
                        .userLon(baseLon)
                        .sort(sortType.name())
                        .build();

        return ApiResponseDto.success("일반 병원 목록 조회 성공", response);
    }
}
