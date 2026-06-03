package com.itcen.emergencyroad.map.service;

import com.itcen.emergencyroad.map.dto.MapGeneralHospitalMarkerProjection;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerBaseProjection;
import com.itcen.emergencyroad.map.dto.MapHospitalMarkerResponseDto;
import com.itcen.emergencyroad.map.dto.MapPediatricHospitalMarkerProjection;
import com.itcen.emergencyroad.map.dto.MapPregnantHospitalMarkerProjection;
import com.itcen.emergencyroad.map.enums.MapCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MapHospitalMarkerMapper {
    private final MapStatusCalculator statusCalculator;
    private final MapDistrictResolver districtResolver;

    public MapHospitalMarkerResponseDto toGeneralMarker(
            MapGeneralHospitalMarkerProjection hospital
    ) {
        return baseMarkerBuilder(hospital, MapCategory.GENERAL)
                .status(statusCalculator.createEmergencyBedStatus(
                        hospital.getEmergencyAvailableBeds(),
                        hospital.getEmergencyTotalBeds()
                ))
                .build();
    }

    public MapHospitalMarkerResponseDto toPediatricMarker(
            MapPediatricHospitalMarkerProjection hospital
    ) {
        return baseMarkerBuilder(hospital, MapCategory.PEDIATRIC)
                .status(statusCalculator.createPediatricBedStatus(
                        hospital.getPediatricAvailableBeds(),
                        hospital.getPediatricTotalBeds()
                ))
                .build();
    }

    public MapHospitalMarkerResponseDto toPregnantMarker(
            MapPregnantHospitalMarkerProjection hospital
    ) {
        return baseMarkerBuilder(hospital, MapCategory.PREGNANT)
                .status(statusCalculator.createPregnantStatus(
                        hospital.getNicuBedCount(),
                        hospital.getNicuStandard(),
                        hospital.getDeliveryAvailable()
                ))
                .build();
    }

    private MapHospitalMarkerResponseDto.MapHospitalMarkerResponseDtoBuilder baseMarkerBuilder(
            MapHospitalMarkerBaseProjection hospital,
            MapCategory category
    ) {
        return MapHospitalMarkerResponseDto.builder()
                .hpid(hospital.getHpid())
                .hospitalName(hospital.getHospitalName())
                .category(category)
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .address(hospital.getAddress())
                .emergencyPhone(hospital.getEmergencyPhone())
                .areaCode(null)
                .areaName(districtResolver.extractDistrictName(hospital.getAddress()))
                .recordedAt(hospital.getRecordedAt());
    }
}
