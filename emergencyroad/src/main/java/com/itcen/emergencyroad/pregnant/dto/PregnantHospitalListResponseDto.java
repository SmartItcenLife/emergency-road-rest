package com.itcen.emergencyroad.pregnant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class PregnantHospitalListResponseDto {

    private List<PregnantHospitalListDto> hospitals;

    private Boolean locationProvided;

    private String displayLocation;

    private Double userLat;

    private Double userLon;

    private String sort;
}
