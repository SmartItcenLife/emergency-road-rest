package com.itcen.emergencyroad.pediatric.controller;

import com.itcen.emergencyroad.findpath.service.KakaoLocalApiClient;
import com.itcen.emergencyroad.pediatric.dto.PediatricHospitalDetailDto;
import com.itcen.emergencyroad.pediatric.dto.PediatricHospitalListDto;
import com.itcen.emergencyroad.pediatric.dto.PediatricHospitalListResponseDto;
import com.itcen.emergencyroad.pediatric.service.PediatricViewService;
import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.recommend.entity.HospitalSortType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hospitals/pediatric")
public class PediatricController {

    private final PediatricViewService pediatricViewService;
    private final KakaoLocalApiClient kakaoLocalApiClient;

    @GetMapping
    public ApiResponseDto<PediatricHospitalListResponseDto> hospitalList(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false, defaultValue = "SCORE") String sort
    ) {
        double baseLat = (lat != null && lat != 0.0) ? lat : 37.5665;
        double baseLon = (lon != null && lon != 0.0) ? lon : 126.9780;

        HospitalSortType sortType = HospitalSortType.from(sort);

        List<PediatricHospitalListDto> hospitals =
                pediatricViewService.getPediatricHospitalList(baseLat, baseLon, sortType);

        String displayLocation = kakaoLocalApiClient.getDisplayLocation(baseLat, baseLon);

        PediatricHospitalListResponseDto response =
                PediatricHospitalListResponseDto.builder()
                        .hospitals(hospitals)
                        .locationProvided(lat != null && lon != null)
                        .displayLocation(displayLocation)
                        .userLat(baseLat)
                        .userLon(baseLon)
                        .sort(sortType.name())
                        .build();

        return ApiResponseDto.success("소아 병원 목록 조회 성공", response);
    }

    @GetMapping("/{hpid}/detail")
    public ApiResponseDto<PediatricHospitalDetailDto> getHospitalDetail(@PathVariable String hpid) {
        PediatricHospitalDetailDto detail =
                pediatricViewService.getPediatricHospitalDetail(hpid);
        return ApiResponseDto.success("소아 병원 상세 조회 성공", detail);
    }
}
