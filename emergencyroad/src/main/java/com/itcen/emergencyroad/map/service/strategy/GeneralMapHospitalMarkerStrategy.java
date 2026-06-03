package com.itcen.emergencyroad.map.service.strategy;

import com.itcen.emergencyroad.map.dto.MapGeneralHospitalMarkerProjection;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.repository.MapHospitalRepository;
import com.itcen.emergencyroad.map.service.MapBounds;
import com.itcen.emergencyroad.map.service.MapHospitalMarkerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GeneralMapHospitalMarkerStrategy implements MapHospitalMarkerStrategy {
    private final MapHospitalRepository mapHospitalRepository;
    private final MapHospitalMarkerMapper markerMapper;

    @Override
    public MapCategory getCategory() {
        return MapCategory.GENERAL;
    }

    @Override
    public List<MapHospitalMarkerResponseDto> getHospitals(MapBounds bounds) {
        List<MapGeneralHospitalMarkerProjection> hospitals;

        if (bounds != null) {
            hospitals = mapHospitalRepository.findGeneralHospitalMarkersInBounds(
                    bounds.minLat(),
                    bounds.minLon(),
                    bounds.maxLat(),
                    bounds.maxLon()
            );
        } else {
            hospitals = mapHospitalRepository.findGeneralHospitalMarkers();
        }

        return hospitals.stream()
                .map(markerMapper::toGeneralMarker)
                .toList();
    }
}
