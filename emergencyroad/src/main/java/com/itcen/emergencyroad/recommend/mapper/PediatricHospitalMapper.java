package com.itcen.emergencyroad.recommend.mapper;

import com.itcen.emergencyroad.hospital.entity.Hospital;
import com.itcen.emergencyroad.pediatric.entity.PediatricRealtime;
import com.itcen.emergencyroad.pediatric.entity.PediatricStandard;
import com.itcen.emergencyroad.recommend.dto.PediatricHospitalResponseDto;
import com.itcen.emergencyroad.recommend.entity.GeneralInfo;
import com.itcen.emergencyroad.recommend.entity.HospitalScore;
import com.itcen.emergencyroad.recommend.entity.PediatricInfo;
import com.itcen.emergencyroad.recommend.service.PediatricCongestionCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PediatricHospitalMapper {

    private final PediatricCongestionCalculator congestionCalculator;



    public PediatricHospitalResponseDto toDto(
            HospitalScore score,
            double finalScore,
            double distance,
            double duration
    ) {

        Hospital hospital = score.getHospital();

        PediatricInfo info = score.getPediatricInfo();

        Integer bed = info.getPediatricBedCount();
        Integer total = info.getPediatricBedStandard();
        String incubator = info.getIncubatorAvailable();

        double percent = congestionCalculator.getPercentage(bed, total);
        String label = congestionCalculator.getLabel(bed, total);

        return PediatricHospitalResponseDto.builder()
                .hospitalName(hospital.getHospitalName())
                .hpid(hospital.getHpid())
                .finalScore(finalScore)
                .distance(distance)
                .duration(duration)
                .address(hospital.getAddress())

                .availablePediatricBedCount(bed)
                .totalPediatricBedCount(total)

                .incubatorAvailable(incubator)
                .congestionLabel(label)
                .availableBedPercentage(percent)

                .emergencyPhone(hospital.getEmergencyPhone())

                .hospitalLatitude(hospital.getLatitude())
                .hospitalLongitude(hospital.getLongitude())

                .tags(score.getPediatricTags())
                .build();
    }


}