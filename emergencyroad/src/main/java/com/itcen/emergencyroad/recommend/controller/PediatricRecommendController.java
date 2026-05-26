package com.itcen.emergencyroad.recommend.controller;

import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.recommend.dto.PediatricHospitalResponseDto;
import com.itcen.emergencyroad.recommend.entity.HospitalCategory;
import com.itcen.emergencyroad.recommend.service.HospitalRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommend/pediatric")
@RequiredArgsConstructor
public class PediatricRecommendController {
    private final HospitalRecommendationService recommendationService;

    @GetMapping
    public ApiResponseDto<List<PediatricHospitalResponseDto>> getRankings(
            @RequestParam Double lat,
            @RequestParam Double lon
    ) {

        List<PediatricHospitalResponseDto> rankings =
                recommendationService.getTop3(
                        HospitalCategory.PEDIATRIC,
                        lat,
                        lon,
                        PediatricHospitalResponseDto.class
                );

        return ApiResponseDto.success(
                "소아과 병원 추천 성공",
                rankings
        );
    }
}
