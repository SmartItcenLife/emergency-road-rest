package com.itcen.emergencyroad.map.repository;

import com.itcen.emergencyroad.map.entity.MapArea;
import com.itcen.emergencyroad.map.enums.MapAreaLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MapAreaRepository extends JpaRepository<MapArea, String> {
    @Query("""
        select a
        from MapArea a
        where a.sidoCode = :sidoCode
          and a.areaLevel = :areaLevel
          and a.active = true
        order by a.displayOrder asc
    """)
    List<MapArea> findActiveAreasBySidoAndLevel(
            String sidoCode,
            MapAreaLevel areaLevel
    );

    @Query("""
        select a
        from MapArea a
        where a.areaName = :areaName
          and a.areaLevel = :areaLevel
          and a.active = true
    """)
    Optional<MapArea> findActiveAreaByNameAndLevel(
            String areaName,
            MapAreaLevel areaLevel
    );
}