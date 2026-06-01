package com.itcen.emergencyroad.recommend.mapper;

import com.itcen.emergencyroad.hospital.entity.Hospital;
import com.itcen.emergencyroad.recommend.dto.GeneralHospitalResponseDto;
import com.itcen.emergencyroad.recommend.entity.GeneralInfo;
import com.itcen.emergencyroad.recommend.entity.HospitalScore;
import com.itcen.emergencyroad.recommend.service.PediatricCongestionCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GeneralHospitalMapper {
    private final PediatricCongestionCalculator congestionCalculator;

    public GeneralHospitalResponseDto toDto(
            HospitalScore score,
            double finalScore,
            double distance,
            double duration
    ) {
        Hospital hospital = score.getHospital();
        GeneralInfo info = score.getGeneralInfo();

        Integer availableBed = info.getAvailableBeds();
        Integer totalBed  = info.getTotalBeds();

        double percent = congestionCalculator.getPercentage(availableBed, totalBed);
        String label = congestionCalculator.getLabel(availableBed, totalBed);

        return GeneralHospitalResponseDto.builder()
                .hospitalName(hospital.getHospitalName())
                .hpid(hospital.getHpid())
                .finalScore(finalScore)
                .distance(distance)
                .duration(duration)
                .address(hospital.getAddress())
                .availableEmergencyBedCount(availableBed)
                .totalEmergencyBedCount(totalBed)
                .hospitalLatitude(hospital.getLatitude())
                .hospitalLongitude(hospital.getLongitude())
                .emergencyPhone(hospital.getEmergencyPhone())
                .recordedAt(score.getRecordedAt())
                .congestionLabel(label)
                .availableBedPercentage(percent)
                .tags(score.getGeneralTags())
                .build();
    }
}
