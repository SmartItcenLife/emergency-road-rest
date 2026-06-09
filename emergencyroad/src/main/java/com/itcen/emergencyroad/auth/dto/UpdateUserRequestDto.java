package com.itcen.emergencyroad.auth.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
public class UpdateUserRequestDto {

  @Size(max = 30, message = "닉네임은 30자 이하로 입력해주세요.")
  private String nickname;
}
