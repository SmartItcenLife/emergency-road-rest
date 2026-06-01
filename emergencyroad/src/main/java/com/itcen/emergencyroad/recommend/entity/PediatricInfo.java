package com.itcen.emergencyroad.recommend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PediatricInfo {
    private Integer pediatricBedCount;
    private Integer pediatricBedStandard;
    private String incubatorAvailable;
}