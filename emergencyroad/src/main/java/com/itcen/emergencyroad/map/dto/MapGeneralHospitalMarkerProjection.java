package com.itcen.emergencyroad.map.dto;

import java.time.LocalDateTime;

public interface MapGeneralHospitalMarkerProjection {
    String getHpid();
    String getHospitalName();
    Double getLatitude();
    Double getLongitude();
    String getAddress();
    String getEmergencyPhone();
    Integer getEmergencyAvailableBeds();
    Integer getEmergencyTotalBeds();
    LocalDateTime getRecordedAt();
}