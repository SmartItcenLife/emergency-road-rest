package com.itcen.emergencyroad.map.service.strategy;

import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.service.MapBounds;

import java.util.List;

public interface MapHospitalMarkerStrategy {
    MapCategory getCategory();

    List<MapHospitalMarkerResponseDto> getHospitals(MapBounds bounds);
}
