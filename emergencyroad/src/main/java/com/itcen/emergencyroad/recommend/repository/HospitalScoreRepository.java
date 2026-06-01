package com.itcen.emergencyroad.recommend.repository;

import com.itcen.emergencyroad.recommend.entity.HospitalScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalScoreRepository extends JpaRepository<HospitalScore,String>  {
    Optional<HospitalScore> findByHospital_Hpid(String hpid);
    //JOIN FETCH를 사용하여 Hospital 정보를 한 번에 가져옴
    @Query("SELECT s FROM HospitalScore s JOIN FETCH s.hospital WHERE s.pregnantScore > :score")
    List<HospitalScore> findAllByPregnantScoreGreaterThan(@Param("score")Double score);
    @Query("SELECT s FROM HospitalScore s JOIN FETCH s.hospital WHERE s.generalScore > :score")
    List<HospitalScore> findAllByGeneralScoreGreaterThan(@Param("score") Double score);
    @Query("SELECT s FROM HospitalScore s JOIN FETCH s.hospital WHERE s.pediatricScore > :score")
    List<HospitalScore> findAllByPediatricScoreGreaterThan(@Param("score") Double score);
}
