package com.itcen.emergencyroad.community.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class RefreshTokenRequestDto {

  @NotBlank(message = "Refresh Token을 입력해주세요.")
  private String refreshToken;
}
