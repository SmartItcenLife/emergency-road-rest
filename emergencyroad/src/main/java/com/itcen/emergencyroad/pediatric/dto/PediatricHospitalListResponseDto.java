package com.itcen.emergencyroad.pediatric.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class PediatricHospitalListResponseDto {

    private List<PediatricHospitalListDto> hospitals;

    private Boolean locationProvided;

    private String displayLocation;

    private Double userLat;

    private Double userLon;

    private String sort;
}
