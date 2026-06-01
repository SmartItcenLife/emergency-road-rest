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
public class GeneralInfo {
    private Integer availableBeds;
    private Integer totalBeds;
}
