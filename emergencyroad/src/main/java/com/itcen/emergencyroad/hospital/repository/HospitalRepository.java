package com.itcen.emergencyroad.hospital.repository;

import com.itcen.emergencyroad.hospital.entity.Hospital;
import java.util.Optional;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

public interface HospitalRepository extends JpaRepositoryImplementation<Hospital, String> {
  Optional<Hospital> findByHpid(String hpid);

}
