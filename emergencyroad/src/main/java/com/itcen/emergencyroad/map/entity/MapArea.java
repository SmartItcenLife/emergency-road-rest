package com.itcen.emergencyroad.map.entity;

import com.itcen.emergencyroad.map.enums.MapAreaLevel;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="map_area")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MapArea {

    @Id
    @Column(name = "area_code", length = 10, nullable = false)
    private String areaCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "area_level", length = 20, nullable = false)
    private MapAreaLevel areaLevel;

    @Column(name = "area_name", length = 50, nullable = false)
    private String areaName;

    @Column(name = "sido_code", length = 10, nullable = false)
    private String sidoCode;

    @Column(name = "sido_name", length = 50, nullable = false)
    private String sidoName;

    @Column(name = "parent_area_code", length = 10)
    private String parentAreaCode;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "active", nullable = false)
    private boolean active;

    private MapArea(
            String areaCode,
            MapAreaLevel areaLevel,
            String areaName,
            String sidoCode,
            String sidoName,
            String parentAreaCode,
            Integer displayOrder,
            Boolean active
    ) {
        this.areaCode = areaCode;
        this.areaLevel = areaLevel;
        this.areaName = areaName;
        this.sidoCode = sidoCode;
        this.sidoName = sidoName;
        this.parentAreaCode = parentAreaCode;
        this.displayOrder = displayOrder;
        this.active = active;
    }

    // 팩토리 메소드
    // 서울시 구 데이터의 모든 데이터가 공통으로 가질 값 지정된 형태로 정의하여 실수 발생 시 문제 발생 확률을 줄임
    // 서울시 한정 가능
    public static MapArea createDistrict(
            String areaCode,
            String areaName,
            Integer displayOrder
    ) {
        return new MapArea(
                areaCode,
                MapAreaLevel.DISTRICT,
                areaName,
                "11",
                "서울특별시",
                "11",
                displayOrder,
                true
        );
    }
}
