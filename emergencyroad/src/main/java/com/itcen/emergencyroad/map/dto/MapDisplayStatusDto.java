package com.itcen.emergencyroad.map.dto;

import com.itcen.emergencyroad.map.enums.MapCongestionGrade;
import com.itcen.emergencyroad.map.enums.MapMetricType;
import com.itcen.emergencyroad.map.enums.MapStatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
// 프론트가 grade, label, colorLevel만 보고 지도 렌더링을 할 수 있게 만들기 위함
public class MapDisplayStatusDto {
    //상태 표현 방식
    private MapStatusType type;     // SCORE, STATUS

    // 어떤 의료 자원을 기준으로 계산했는지
    private MapMetricType metricType;   // EMERGENCY_BED, PEDIATRIC_BED, NICU, DELIVERY_ROOM

    // 화면 표시용 최종 등급
    private MapCongestionGrade grade;   // RELAXED, NORMAL, CROWDED, AVAILABLE, UNAVAILABLE, UNKNOWN

    // 사용자에게 보여줄 등급
    private Integer colorLevel;         // (여유, 보통, 혼잡) / (가능, 불가), 정보없음

    // 점수형 상태에서 사용할 값
    private Integer score;              // 0 ~ 100 높을수록 여유

    // 계산 근거
    private Integer availableCount;      // 가용 수
    private Integer totalCount;          // 전체기준수
    private Integer rate;                // 가용률

}
