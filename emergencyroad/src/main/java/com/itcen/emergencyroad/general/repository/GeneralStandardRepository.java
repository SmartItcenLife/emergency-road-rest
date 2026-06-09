package com.itcen.emergencyroad.general.repository;

import com.itcen.emergencyroad.general.entity.GeneralStandard;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GeneralStandardRepository extends JpaRepository<GeneralStandard, Long> {
   Optional<GeneralStandard> findByHospital(Hospital hospital);
}
