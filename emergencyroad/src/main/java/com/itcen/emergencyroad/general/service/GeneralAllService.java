package com.itcen.emergencyroad.general.service;

import com.itcen.emergencyroad.external.dto.EmrDto;
import com.itcen.emergencyroad.external.mapper.EmrMapper;
import com.itcen.emergencyroad.general.entity.GeneralMkioskty;
import com.itcen.emergencyroad.general.entity.GeneralRealtime;
import com.itcen.emergencyroad.general.entity.GeneralStandard;
import com.itcen.emergencyroad.general.repository.GeneralMkiosktyRepository;
import com.itcen.emergencyroad.general.repository.GeneralRealtimeRepository;
import com.itcen.emergencyroad.general.repository.GeneralStandardRepository;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import com.itcen.emergencyroad.hospital.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeneralAllService {
    private final GeneralRealtimeRepository generalRealtimeRepository;
    private final GeneralStandardRepository generalStandardRepository;
    private final GeneralMkiosktyRepository generalMkiosktyRepository;
    private final HospitalRepository hospitalRepository;
    private final EmrMapper emrMapper;

    @Transactional
    public void saveOrUpdate(List<EmrDto> list) {

        for (EmrDto dto : list) {
            log.info("dto hpid = {}", dto.getHpid());

            Hospital hospital = hospitalRepository.findByHpid(dto.getHpid())
                    .orElse(null);
            log.info("hospital exists = {}", hospital != null);
            if (hospital == null) continue;

            GeneralRealtime realtime = generalRealtimeRepository.findByHospital(hospital)
                    .orElseGet(()->emrMapper.toGeneralRealtimeEntity(dto, hospital));
            emrMapper.updateGeneralRealtimeEntity(realtime, dto);
            generalRealtimeRepository.save(realtime);

            GeneralStandard standard = generalStandardRepository.findByHospital(hospital)
                    .orElseGet(()->emrMapper.toGeneralStandardEntity(dto, hospital));
            emrMapper.updateGeneralStandardEntity(standard, dto);
            generalStandardRepository.save(standard);

            GeneralMkioskty mkioskty = generalMkiosktyRepository.findByHospital(hospital)
                    .orElseGet(()->emrMapper.toGeneralMkiosktyEntity(dto, hospital));
            emrMapper.updateGeneralMkiosktyEntity(mkioskty, dto);
            generalMkiosktyRepository.save(mkioskty);
        }
    }
}
