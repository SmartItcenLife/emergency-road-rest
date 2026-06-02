package com.itcen.emergencyroad.map.dto;

public interface MapGeneralHospitalMarkerProjection extends MapHospitalMarkerBaseProjection {
    Integer getEmergencyAvailableBeds();
    Integer getEmergencyTotalBeds();
}
