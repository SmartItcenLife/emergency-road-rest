package com.itcen.emergencyroad.general.repository;

import com.itcen.emergencyroad.general.entity.GeneralRealTimeAndStandard;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GeneralRepository extends JpaRepository<GeneralRealTimeAndStandard, Long> {

   Optional<GeneralRealTimeAndStandard> findByHospital(Hospital hospital);
}
