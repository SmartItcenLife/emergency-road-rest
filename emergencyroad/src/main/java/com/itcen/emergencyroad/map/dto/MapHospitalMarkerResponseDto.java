package com.itcen.emergencyroad.map.dto;

import com.itcen.emergencyroad.map.enums.MapCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MapHospitalMarkerResponseDto {

    private String hpid;              // 병원 ID
    private String hospitalName;      // 병원명

    private MapCategory category;     // GENERAL, PEDIATRIC, PREGNANT

    private Double latitude;          // 위도
    private Double longitude;         // 경도

    private String address;           // 주소
    private String emergencyPhone;    // 응급실 전화번호

    private String areaCode;          // 구/동 코드
    private String areaName;          // 구/동 이름

    private MapDisplayStatusDto status;

    private LocalDateTime recordedAt;
}