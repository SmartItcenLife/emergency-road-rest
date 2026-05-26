package com.itcen.emergencyroad.map.repository;

import com.itcen.emergencyroad.hospital.entity.Hospital;
import com.itcen.emergencyroad.map.dto.MapGeneralHospitalMarkerProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MapHospitalRepository extends JpaRepository<Hospital, String> {
    @Query("""
        select
            h.hpid as hpid,
            h.hospitalName as hospitalName,
            h.latitude as latitude,
            h.longitude as longitude,
            h.address as address,
            h.emergencyPhone as emergencyPhone,
            gr.emergencyAvailableBeds as emergencyAvailableBeds,
            gr.emergencyTotalBeds as emergencyTotalBeds,
            gr.recordedAt as recordedAt
        from Hospital h
        left join GeneralRealTimeAndStandard gr on gr.hospital = h
        where h.latitude is not null
          and h.longitude is not null
          and h.hasEmergency = true
    """)
    List<MapGeneralHospitalMarkerProjection> findGeneralHospitalMarkers();

    @Query("""
        select
            h.hpid as hpid,
            h.hospitalName as hospitalName,
            h.latitude as latitude,
            h.longitude as longitude,
            h.address as address,
            h.emergencyPhone as emergencyPhone,
            gr.emergencyAvailableBeds as emergencyAvailableBeds,
            gr.emergencyTotalBeds as emergencyTotalBeds,
            gr.recordedAt as recordedAt
        from Hospital h
        left join GeneralRealTimeAndStandard gr on gr.hospital = h
        where h.latitude is not null
          and h.longitude is not null
          and h.hasEmergency = true
          and h.latitude between :swLat and :neLat
          and h.longitude between :swLon and :neLon
    """)
    List<MapGeneralHospitalMarkerProjection> findGeneralHospitalMarkersInBounds(
            @Param("swLat") Double swLat,
            @Param("swLon") Double swLon,
            @Param("neLat") Double neLat,
            @Param("neLon") Double neLon
    );
}
