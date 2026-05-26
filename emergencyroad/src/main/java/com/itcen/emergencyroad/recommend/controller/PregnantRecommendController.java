package com.itcen.emergencyroad.recommend.controller;

import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.recommend.dto.PregnantHospitalResponseDto;
import com.itcen.emergencyroad.recommend.entity.HospitalCategory;
import com.itcen.emergencyroad.recommend.service.HospitalRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommend/pregnant")
@RequiredArgsConstructor
public class PregnantRecommendController {

    private final HospitalRecommendationService recommendationService;

    @GetMapping
    public ApiResponseDto<List<PregnantHospitalResponseDto>> getRankings(
            @RequestParam Double lat,
            @RequestParam Double lon
    ) {

        List<PregnantHospitalResponseDto> rankings =
                recommendationService.getTop3(
                        HospitalCategory.PREGNANT,
                        lat,
                        lon,
                        PregnantHospitalResponseDto.class
                );

        return ApiResponseDto.success(
                "산부인과 병원 추천 성공",
                rankings
        );
    }
}