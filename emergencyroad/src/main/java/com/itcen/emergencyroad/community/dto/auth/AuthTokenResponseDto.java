package com.itcen.emergencyroad.community.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AuthTokenResponseDto {

  private String accessToken;
  private String refreshToken;
  private Long userId;
  private String nickname;
  private String profileImageUrl;
  private String role;
}
