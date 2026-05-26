package com.itcen.emergencyroad.map.dto;

import com.itcen.emergencyroad.map.enums.MapAreaLevel;
import com.itcen.emergencyroad.map.enums.MapCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MapAreaCongestionResponseDto {
    private String areaCode;        // 구 코드 또는 동 코드
    private String areaName;        // 구 또는 동 이름

    private MapAreaLevel areaLevel;  // 화면에 보여줄 기준 DISTRICT, DONG
    private MapCategory category;   // 요청 유형, general, pediatric, pregnant

    private MapDisplayStatusDto status; // 상태값

    private Integer hospitalCount;  // 핻아 구/동 내 병원 수

    private LocalDateTime updatedAt;    // 집계 기준 시간
}
