package com.itcen.emergencyroad.map.repository;

import com.itcen.emergencyroad.hospital.entity.Hospital;
import com.itcen.emergencyroad.map.dto.MapAreaCongestionProjection;
import com.itcen.emergencyroad.map.dto.MapGeneralHospitalMarkerProjection;
import com.itcen.emergencyroad.map.dto.MapPediatricHospitalMarkerProjection;
import com.itcen.emergencyroad.map.dto.MapPregnantHospitalMarkerProjection;
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
            gs.emergencyTotalBeds as emergencyTotalBeds,
            gr.recordedAt as recordedAt
        from Hospital h
        left join GeneralRealtime gr on gr.hospital = h
        left join GeneralStandard gs on gs.hospital = h
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
            gs.emergencyTotalBeds as emergencyTotalBeds,
            gr.recordedAt as recordedAt
        from Hospital h
        left join GeneralRealtime gr on gr.hospital = h
        left join GeneralStandard gs on gs.hospital = h
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

    @Query("""
        select
            h.hpid as hpid,
            h.hospitalName as hospitalName,
            h.latitude as latitude,
            h.longitude as longitude,
            h.address as address,
            h.emergencyPhone as emergencyPhone,
            hs.pediatricInfo.pediatricBedCount as pediatricAvailableBeds,
            hs.pediatricInfo.pediatricBedStandard as pediatricTotalBeds,
            hs.recordedAt as recordedAt
        from HospitalScore hs
        join hs.hospital h
        where h.latitude is not null
          and h.longitude is not null
          and hs.pediatricScore > 0
    """)
    List<MapPediatricHospitalMarkerProjection> findPediatricHospitalMarkers();

    @Query("""
        select
            h.hpid as hpid,
            h.hospitalName as hospitalName,
            h.latitude as latitude,
            h.longitude as longitude,
            h.address as address,
            h.emergencyPhone as emergencyPhone,
            hs.pediatricInfo.pediatricBedCount as pediatricAvailableBeds,
            hs.pediatricInfo.pediatricBedStandard as pediatricTotalBeds,
            hs.recordedAt as recordedAt
        from HospitalScore hs
        join hs.hospital h
        where h.latitude is not null
          and h.longitude is not null
          and hs.pediatricScore > 0
          and h.latitude between :swLat and :neLat
          and h.longitude between :swLon and :neLon
    """)
    List<MapPediatricHospitalMarkerProjection> findPediatricHospitalMarkersInBounds(
            @Param("swLat") Double swLat,
            @Param("swLon") Double swLon,
            @Param("neLat") Double neLat,
            @Param("neLon") Double neLon
    );

    @Query("""
        select
            h.hpid as hpid,
            h.hospitalName as hospitalName,
            h.latitude as latitude,
            h.longitude as longitude,
            h.address as address,
            h.emergencyPhone as emergencyPhone,
            hs.pregnantInfo.nicuBedCount as nicuBedCount,
            hs.pregnantInfo.nicuStandard as nicuStandard,
            hs.pregnantInfo.deliveryAvailable as deliveryAvailable,
            hs.recordedAt as recordedAt
        from HospitalScore hs
        join hs.hospital h
        where h.latitude is not null
          and h.longitude is not null
          and hs.pregnantScore > 0
    """)
    List<MapPregnantHospitalMarkerProjection> findPregnantHospitalMarkers();

    @Query("""
        select
            h.hpid as hpid,
            h.hospitalName as hospitalName,
            h.latitude as latitude,
            h.longitude as longitude,
            h.address as address,
            h.emergencyPhone as emergencyPhone,
            hs.pregnantInfo.nicuBedCount as nicuBedCount,
            hs.pregnantInfo.nicuStandard as nicuStandard,
            hs.pregnantInfo.deliveryAvailable as deliveryAvailable,
            hs.recordedAt as recordedAt
        from HospitalScore hs
        join hs.hospital h
        where h.latitude is not null
          and h.longitude is not null
          and hs.pregnantScore > 0
          and h.latitude between :swLat and :neLat
          and h.longitude between :swLon and :neLon
    """)
    List<MapPregnantHospitalMarkerProjection> findPregnantHospitalMarkersInBounds(
            @Param("swLat") Double swLat,
            @Param("swLon") Double swLon,
            @Param("neLat") Double neLat,
            @Param("neLon") Double neLon
    );

    @Query("""
    select
        h.address as address,
        gr.emergencyAvailableBeds as availableCount,
        gs.emergencyTotalBeds as totalCount,
        gr.recordedAt as recordedAt
    from Hospital h
    left join GeneralRealtime gr on gr.hospital = h
    left join GeneralStandard gs on gs.hospital = h
    where h.hasEmergency = true
      and h.address is not null
""")
    List<MapAreaCongestionProjection> findGeneralAreaCongestionSources();

    @Query("""
        select
            h.address as address,
            pr.pediatricBedCount as availableCount,
            ps.pediatricBedStandard as totalCount,
            pr.recordedAt as recordedAt
        from Hospital h
        left join PediatricRealtime pr on pr.hospital = h
        left join PediatricStandard ps on ps.hospital = h
        where h.address is not null
          and ps.pediatricBedStandard is not null
          and ps.pediatricBedStandard > 0
    """)
    List<MapAreaCongestionProjection> findPediatricAreaCongestionSources();

    @Query("""
        select
            h.address as address,
            pr.nicuBedCount as availableCount,
            ps.nicuStandard as totalCount,
            pr.updatedAt as recordedAt
        from Hospital h
        left join PregnantRealtime pr on pr.hospital = h
        left join PregnantStandard ps on ps.hospital = h
        where h.address is not null
          and ps.nicuStandard is not null
          and ps.nicuStandard > 0
    """)
    List<MapAreaCongestionProjection> findPregnantAreaCongestionSources();
}
