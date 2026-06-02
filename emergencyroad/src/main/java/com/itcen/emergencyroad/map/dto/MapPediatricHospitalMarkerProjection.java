package com.itcen.emergencyroad.map.dto;

public interface MapPediatricHospitalMarkerProjection extends MapHospitalMarkerBaseProjection {
    Integer getPediatricAvailableBeds();
    Integer getPediatricTotalBeds();
}
