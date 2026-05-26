package com.itcen.emergencyroad.general.repository;

import com.itcen.emergencyroad.general.dto.GeneralHospitalDetailDto;
import com.itcen.emergencyroad.general.entity.GeneralRealTimeAndStandard;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GeneralRepository extends JpaRepository<GeneralRealTimeAndStandard, Long> {

   Optional<GeneralRealTimeAndStandard> findByHospital(Hospital hospital);

   @Query("""
    select new com.itcen.emergencyroad.general.dto.GeneralHospitalDetailDto(
        h.hpid,
        h.address,
        h.emergencyPhone,
        h.phone,

        gr.emergencyAvailableBeds,
        gr.emergencyTotalBeds,

        gr.icuAvailableBeds,
        gr.icuTotalBeds,
        gr.neuroIcuAvailableBeds,
        gr.neuroIcuTotalBeds,
        gr.chestIcuAvailableBeds,
        gr.chestIcuTotalBeds,

        gr.ctAvailable,
        gr.mriAvailable,
        gr.ventilatorAvailable,
        gr.crrtAvailable,
        gr.ecmoAvailable,
        gr.angioAvailable,

        gs.MKioskTy1,
        gs.MKioskTy2,
        gs.MKioskTy3,
        gs.MKioskTy4,
        gs.MKioskTy5,
        gs.MKioskTy6,
        gs.MKioskTy23,
        gs.MKioskTy24,
        gs.MKioskTy11,
        gs.MKioskTy13,
        gs.MKioskTy19,
        gs.MKioskTy26,
        
        gr.recordedAt
    )
    from GeneralRealTimeAndStandard gr
    join gr.hospital h
    left join GeneralSrsIll gs on gs.hospital = h
    where h.hpid = :hpid
""")
   Optional<GeneralHospitalDetailDto> findGeneralHospitalDetail(@Param("hpid") String hpid);
}
