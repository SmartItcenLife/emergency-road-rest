package com.itcen.emergencyroad.map.dto;

import java.time.LocalDateTime;

public interface MapHospitalMarkerBaseProjection {
    String getHpid();
    String getHospitalName();
    Double getLatitude();
    Double getLongitude();
    String getAddress();
    String getEmergencyPhone();
    LocalDateTime getRecordedAt();
}
