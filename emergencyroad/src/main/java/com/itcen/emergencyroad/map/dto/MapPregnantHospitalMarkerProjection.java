package com.itcen.emergencyroad.map.dto;

public interface MapPregnantHospitalMarkerProjection extends MapHospitalMarkerBaseProjection {
    Integer getNicuBedCount();
    Integer getNicuStandard();
    String getDeliveryAvailable();
}
