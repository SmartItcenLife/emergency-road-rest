package com.itcen.emergencyroad.community.dto.report;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReportRequestDTO {

    @NotBlank(message = "신고 사유를 선택해주세요.")
    private String reason;
}