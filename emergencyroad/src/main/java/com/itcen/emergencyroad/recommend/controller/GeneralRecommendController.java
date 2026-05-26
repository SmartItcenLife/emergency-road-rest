package com.itcen.emergencyroad.recommend.controller;

import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.recommend.dto.GeneralHospitalResponseDto;
import com.itcen.emergencyroad.recommend.entity.HospitalCategory;
import com.itcen.emergencyroad.recommend.service.HospitalRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommend/general")
@RequiredArgsConstructor
public class GeneralRecommendController {

    private final HospitalRecommendationService recommendationService;

    @GetMapping
    public ApiResponseDto<List<GeneralHospitalResponseDto>> getRankings(
            @RequestParam Double lat,
            @RequestParam Double lon
    ) {

        List<GeneralHospitalResponseDto> rankings =
                recommendationService.getTop3(
                        HospitalCategory.GENERAL,
                        lat,
                        lon,
                        GeneralHospitalResponseDto.class
                );

        return ApiResponseDto.success(
                "일반 병원 추천 성공",
                rankings
        );
    }
}