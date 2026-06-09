package com.itcen.emergencyroad.general.repository;

import com.itcen.emergencyroad.general.dto.GeneralHospitalDetailDto;
import com.itcen.emergencyroad.general.entity.GeneralRealtime;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GeneralRealtimeRepository extends JpaRepository<GeneralRealtime, Long> {
    Optional<GeneralRealtime> findByHospital(Hospital hospital);

    @Query("""
        select new com.itcen.emergencyroad.general.dto.GeneralHospitalDetailDto(
            h.hpid,
            h.address,
            h.emergencyPhone,
            h.phone,

            gr.emergencyAvailableBeds,
            gs.emergencyTotalBeds,

            gr.icuAvailableBeds,
            gs.icuTotalBeds,
            gr.neuroIcuAvailableBeds,
            gs.neuroIcuTotalBeds,
            gr.chestIcuAvailableBeds,
            gs.chestIcuTotalBeds,

            gs.ctAvailable,
            gs.mriAvailable,
            gs.ventilatorAvailable,
            gs.crrtAvailable,
            gs.ecmoAvailable,
            gs.angioAvailable,

            gm.MKioskTy1,
            gm.MKioskTy2,
            gm.MKioskTy3,
            gm.MKioskTy4,
            gm.MKioskTy5,
            gm.MKioskTy6,
            gm.MKioskTy23,
            gm.MKioskTy24,
            gm.MKioskTy11,
            gm.MKioskTy13,
            gm.MKioskTy19,
            gm.MKioskTy26,

            gr.recordedAt
        )
        from GeneralRealtime gr
        join gr.hospital h
        left join GeneralStandard gs on gs.hospital = h
        left join GeneralMkioskty gm on gm.hospital = h
        where h.hpid = :hpid
        """)
    Optional<GeneralHospitalDetailDto> findGeneralHospitalDetail(@Param("hpid") String hpid);
}
