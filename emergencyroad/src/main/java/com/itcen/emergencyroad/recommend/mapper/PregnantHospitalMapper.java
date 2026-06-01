package com.itcen.emergencyroad.recommend.mapper;

import com.itcen.emergencyroad.recommend.dto.PregnantHospitalResponseDto;
import com.itcen.emergencyroad.recommend.entity.HospitalScore;
import com.itcen.emergencyroad.recommend.entity.PediatricInfo;
import com.itcen.emergencyroad.recommend.entity.PregnantInfo;
import org.springframework.stereotype.Component;

@Component
public class PregnantHospitalMapper {

    public PregnantHospitalResponseDto toDto(
            HospitalScore score,
            double finalScore,
            double distance,
            double duration
    ) {

        var hospital = score.getHospital();
        PregnantInfo info = score.getPregnantInfo();

        return PregnantHospitalResponseDto.builder()
                .hospitalName(hospital.getHospitalName())
                .hpid(hospital.getHpid())
                .finalScore(finalScore)
                .distance(distance)
                .duration(duration)
                .address(hospital.getAddress())
                .tags(score.getPregnantTags())

                // 가능 여부
                .deliveryAvailable(info.getDeliveryAvailable())
                .nicuAvailable(info.getNicuAvailable())
                .obstetricSurgeryAvailable(info.getObstetricSurgeryAvailable())
                .gynecologySurgeryAvailable(info.getGynecologySurgeryAvailable())
                .emergencyDialysisAvailable(info.getEmergencyDialysisAvailable())
                // realtime
                .nicuBedCount(info.getNicuBedCount())
                .incubatorAvailable(info.getIncubatorAvailableP())
                .prematureVentilatorAvailable(info.getPrematureVentilatorAvailable())
                .isDeliveryRoomAvailable(info.getIsDeliveryRoomAvailable())
                // standard
                .deliveryRoomStandard(info.getDeliveryRoomStandard())
                .nicuStandard(info.getNicuStandard())
                .ventilatorStandard(info.getVentilatorStandard())
                .incubatorStandard(info.getIncubatorStandard())

                .emergencyPhone(hospital.getEmergencyPhone())
                .hospitalLatitude(hospital.getLatitude())
                .hospitalLongitude(hospital.getLongitude())
                .build();
    }
}