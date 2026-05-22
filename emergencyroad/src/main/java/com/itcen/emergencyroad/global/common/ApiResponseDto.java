package com.itcen.emergencyroad.global.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@JsonInclude(Include.NON_NULL)
public class ApiResponseDto<T>{

  private final int code;
  private final String status;
  private final String message;
  private final T data;

  private ApiResponseDto(HttpStatus httpStatus, String message, T data) {
    this.code = httpStatus.value();
    this.status = httpStatus.name();
    this.message = message;
    this.data = data;
  }

  // 데이터 있는 성공
  public static <T> ApiResponseDto<T> success(String message, T data) {
    return new ApiResponseDto<>(HttpStatus.OK, message, data);
  }

  // 데이터 없는 성공 (생성, 수정, 삭제 등)
  public static <T> ApiResponseDto<T> success(String message) {
    return new ApiResponseDto<>(HttpStatus.OK, message, null);
  }

  // 실패
  public static <T> ApiResponseDto<T> fail(HttpStatus httpStatus, String message) {
    return new ApiResponseDto<>(httpStatus, message, null);
  }


}
