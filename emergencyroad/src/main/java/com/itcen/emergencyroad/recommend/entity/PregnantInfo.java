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
public class PregnantInfo {
    private String nicuAvailable;
    private String deliveryAvailable;
    private String obstetricSurgeryAvailable;
    private String gynecologySurgeryAvailable;
    private String emergencyDialysisAvailable;
    private String isDeliveryRoomAvailable;
    private Integer nicuBedCount;
    private String incubatorAvailableP;
    private String prematureVentilatorAvailable;
    private Integer deliveryRoomStandard;
    private Integer nicuStandard;
    private Integer ventilatorStandard;
    private Integer incubatorStandard;
}
