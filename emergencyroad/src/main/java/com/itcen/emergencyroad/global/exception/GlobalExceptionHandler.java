package com.itcen.emergencyroad.global.exception;

import com.itcen.emergencyroad.global.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  // 커스텀 예외 (ExceptionStatus 기반)
  @ExceptionHandler(CustomException.class)
  public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
    ExceptionStatus status = e.getExceptionStatus();
    log.warn("[CustomException] {} : {}", status.name(), status.getMessage());

    return ResponseEntity
        .status(status.getStatus())
        .body(ApiResponse.fail(status.getStatus(), status.getMessage()));
  }

  // @Valid 검증 실패
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Void>> handleValidationException(
      MethodArgumentNotValidException e) {

    String message = e.getBindingResult().getFieldErrors().stream()
        .map(fe -> fe.getDefaultMessage())
        .findFirst()
        .orElse("입력값이 올바르지 않습니다.");

    log.warn("[ValidationException] {}", message);

    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ApiResponse.fail(HttpStatus.BAD_REQUEST, message));
  }

  // 그 외 예상치 못한 예외
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
    log.error("[Exception] {}", e.getMessage(), e);

    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.fail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            ExceptionStatus.INTERNAL_SERVER_ERROR.getMessage()
        ));
  }

}
