package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.MapAreaCongestionResponseDto;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.enums.MapCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MapService {
    private final MapHospitalMarkerService markerService;
    private final MapAreaCongestionService areaCongestionService;

    public List<MapHospitalMarkerResponseDto> getHospitals(
            MapCategory category,
            Double swLat,
            Double swLon,
            Double neLat,
            Double neLon
    ) {
        return markerService.getHospitals(
                category,
                swLat,
                swLon,
                neLat,
                neLon
        );
    }

    public List<MapAreaCongestionResponseDto> getAreaCongestion(
            MapCategory category,
            String sidoCode
    ) {
        return areaCongestionService.getAreaCongestion(category, sidoCode);
    }
}
