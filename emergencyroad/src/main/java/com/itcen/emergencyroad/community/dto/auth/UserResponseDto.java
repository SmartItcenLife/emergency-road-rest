package com.itcen.emergencyroad.community.dto.auth;

import com.itcen.emergencyroad.community.entity.User;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {

  private Long userId;
  private String nickname;
  private String email;
  private String profileImageUrl;
  private LocalDateTime createdAt;

  public static UserResponseDto from(User user) {
    return UserResponseDto.builder()
        .userId(user.getId())
        .nickname(user.getNickname())
        .email(user.getEmail())
        .profileImageUrl(user.getProfileImageUrl())
        .createdAt(user.getCreatedAt())
        .build();
  }
}
