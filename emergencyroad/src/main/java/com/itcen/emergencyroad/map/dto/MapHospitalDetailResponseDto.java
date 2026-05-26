package com.itcen.emergencyroad.map.dto;

import com.itcen.emergencyroad.map.enums.MapCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
// 모든 유형별 병원 상세보기 페이지에 보여줄 공통된 정보
public class MapHospitalDetailResponseDto {

    private String hpid;
    private String hospitalName;
    private MapCategory category;

    private String address;
    private String phone;
    private String emergencyPhone;

    private Double latitude;
    private Double longitude;

    private String areaCode;
    private String areaName;

    private MapDisplayStatusDto status;

    private MapGeneralHospitalDetailDto generalDetail;
//    private MapPediatricHospitalDetailDto pediatricDetail;
//    private MapPregnantHospitalDetailDto pregnantDetail;

    private LocalDateTime updatedAt;
}
