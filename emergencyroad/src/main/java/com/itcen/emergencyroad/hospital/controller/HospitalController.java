package com.itcen.emergencyroad.hospital.controller;

import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.hospital.dto.HospitalNameDto;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import com.itcen.emergencyroad.hospital.repository.HospitalRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HospitalController {

  private final HospitalRepository hospitalRepository;

  @Operation
  @GetMapping("/api/hospitals/{hpid}")
  public ResponseEntity<ApiResponseDto<HospitalNameDto>> getHospitalName(
      @PathVariable String hpid){
    String hospitalName = hospitalRepository.findByHpid(hpid)
        .map(Hospital::getHospitalName)
        .orElse(hpid);

    return ResponseEntity.ok(
        ApiResponseDto.success("병원 조회 성공", new HospitalNameDto(hpid, hospitalName))
    );
  }
}
