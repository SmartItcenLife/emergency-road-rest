package com.itcen.emergencyroad.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AuthTokenResponseDto {

  private String accessToken;
  @JsonIgnore
  private String refreshToken;
  private Long userId;
  private String nickname;
  private String profileImageUrl;
  private String role;
}
