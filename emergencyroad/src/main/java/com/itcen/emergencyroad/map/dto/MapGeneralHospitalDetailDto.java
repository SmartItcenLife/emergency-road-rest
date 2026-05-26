package com.itcen.emergencyroad.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
// 일반유형 상세보기 페널에 보여줄 정보
public class MapGeneralHospitalDetailDto {

    private Integer emergencyAvailableBeds;
    private Integer emergencyTotalBeds;

    private Integer icuAvailableBeds;
    private Integer icuTotalBeds;
    private Integer neuroIcuAvailableBeds;
    private String neuroIcuTotalBeds;
    private Integer chestIcuAvailableBeds;
    private Integer chestIcuTotalBeds;

    private String ctAvailable;
    private String mriAvailable;
    private String ventilatorAvailable;
    private String crrtAvailable;
    private String ecmoAvailable;
    private String angioAvailable;

    private String myocardialInfarctionAvailable;
    private String cerebralInfarctionAvailable;
    private String subarachnoidHemorrhageAvailable;
    private String otherHemorrhageAvailable;
    private String aorticChestAvailable;
    private String aorticAbdomenAvailable;
    private String dialysisAvailable;
    private String closedWardAvailable;
    private String endoscopyGiAvailable;
    private String endoscopyBronchialAvailable;
    private String severeBurnsAvailable;
    private String angioAdultAvailable;
}