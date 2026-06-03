package com.itcen.emergencyroad.map.service.strategy;

import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.dto.MapPregnantHospitalMarkerProjection;
import com.itcen.emergencyroad.map.enums.MapCategory;
import com.itcen.emergencyroad.map.repository.MapHospitalRepository;
import com.itcen.emergencyroad.map.service.MapBounds;
import com.itcen.emergencyroad.map.service.MapHospitalMarkerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PregnantMapHospitalMarkerStrategy implements MapHospitalMarkerStrategy {
    private final MapHospitalRepository mapHospitalRepository;
    private final MapHospitalMarkerMapper markerMapper;

    @Override
    public MapCategory getCategory() {
        return MapCategory.PREGNANT;
    }

    @Override
    public List<MapHospitalMarkerResponseDto> getHospitals(MapBounds bounds) {
        List<MapPregnantHospitalMarkerProjection> hospitals;

        if (bounds != null) {
            hospitals = mapHospitalRepository.findPregnantHospitalMarkersInBounds(
                    bounds.minLat(),
                    bounds.minLon(),
                    bounds.maxLat(),
                    bounds.maxLon()
            );
        } else {
            hospitals = mapHospitalRepository.findPregnantHospitalMarkers();
        }

        return hospitals.stream()
                .map(markerMapper::toPregnantMarker)
                .toList();
    }
}
