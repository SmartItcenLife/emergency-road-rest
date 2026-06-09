package com.itcen.emergencyroad.auth.dto.kakao;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoAccountProfileDto {

  private String nickname;

  @JsonProperty("profile_image_url")
  private String profileImageUrl;
}
