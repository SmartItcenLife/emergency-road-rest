package com.itcen.emergencyroad.community.controller;

import com.itcen.emergencyroad.community.dto.auth.LoginRequestDto;
import com.itcen.emergencyroad.community.dto.auth.SignupRequestDto;
import com.itcen.emergencyroad.community.dto.auth.UpdateUserRequestDto;
import com.itcen.emergencyroad.community.dto.auth.AuthTokenResponseDto;
import com.itcen.emergencyroad.community.dto.auth.RefreshTokenRequestDto;
import com.itcen.emergencyroad.community.dto.auth.UserResponseDto;
import com.itcen.emergencyroad.community.service.KakaoService;
import com.itcen.emergencyroad.community.service.TokenService;
import com.itcen.emergencyroad.community.service.UserService;
import com.itcen.emergencyroad.global.common.ApiResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final TokenService tokenService;
  private final KakaoService kakaoService;

  @Operation(summary = "회원가입", description = "로컬 회원가입 (multipart/form-data)")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "회원가입 성공"),
      @ApiResponse(responseCode = "400", description = "유효성 검사 실패"),
      @ApiResponse(responseCode = "409", description = "중복 아이디/닉네임/이메일")
  })
  @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ApiResponseDto<Void>> signup(
      @ParameterObject @Valid @ModelAttribute SignupRequestDto dto,
      @RequestPart(required = false) MultipartFile profileImage) {

    userService.signUp(dto, profileImage);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponseDto.success("회원가입이 완료되었습니다."));
  }

  @Operation(summary = "로컬 로그인", description = "로컬 로그인 후 JWT 발급")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "로그인 성공"),
      @ApiResponse(responseCode = "401", description = "아이디/비밀번호 불일치")
  })
  @PostMapping("/login")
  public ResponseEntity<ApiResponseDto<AuthTokenResponseDto>> login(
      @Valid @RequestBody LoginRequestDto dto) {

    return ResponseEntity.ok(
        ApiResponseDto.success("로그인 성공", userService.login(dto))
    );
  }

  @Operation(summary = "카카오 로그인", description = "카카오 인가코드로 JWT 발급")
  @ApiResponse(responseCode = "200", description = "카카오 로그인 성공")
  @GetMapping("/kakao")
  public ResponseEntity<ApiResponseDto<AuthTokenResponseDto>> kakaoLogin(
      @RequestParam String code) {

    return ResponseEntity.ok(
        ApiResponseDto.success("카카오 로그인 성공", userService.kakaoLogin(code))
    );
  }

  @Operation(summary = "카카오 로그인 URL 조회", description = "카카오 인가 URL 반환")
  @ApiResponse(responseCode = "200", description = "URL 조회 성공")
  @GetMapping("/kakao/redirect")
  public ResponseEntity<ApiResponseDto<String>> getKakaoLoginUrl() {
    return ResponseEntity.ok(
        ApiResponseDto.success("카카오 로그인 URL", kakaoService.getKakaoLoginUrl())
    );
  }

  @Operation(summary = "로그아웃", description = "Refresh Token revoke")
  @ApiResponse(responseCode = "200", description = "로그아웃 성공")
  @PostMapping("/logout")
  public ResponseEntity<ApiResponseDto<Void>> logout(
      @Valid @RequestBody RefreshTokenRequestDto dto) {

    tokenService.revoke(dto.getRefreshToken());
    return ResponseEntity.ok(ApiResponseDto.success("로그아웃 되었습니다."));
  }

  @Operation(summary = "토큰 재발급", description = "Refresh Token으로 Access Token 재발급")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "재발급 성공"),
      @ApiResponse(responseCode = "401", description = "유효하지 않은/만료된/블랙리스트 토큰")
  })
  @PostMapping("/refresh")
  public ResponseEntity<ApiResponseDto<AuthTokenResponseDto>> refresh(
      @Valid @RequestBody RefreshTokenRequestDto dto) {

    return ResponseEntity.ok(
        ApiResponseDto.success("토큰 재발급 성공", tokenService.refresh(dto.getRefreshToken()))
    );
  }

  @Operation(summary = "내 정보 조회", description = "로그인한 사용자 정보 조회")
  @ApiResponse(responseCode = "200", description = "조회 성공")
  @GetMapping("/me")
  public ResponseEntity<ApiResponseDto<UserResponseDto>> getMyInfo(
      @AuthenticationPrincipal Long userId) {

    return ResponseEntity.ok(
        ApiResponseDto.success("내 정보 조회 성공", userService.getUser(userId)));
  }

  @Operation(summary = "회원정보 수정", description = "닉네임/프로필 이미지 수정")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "수정 성공"),
      @ApiResponse(responseCode = "409", description = "중복 닉네임")
  })
  @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ApiResponseDto<Void>> updateUser(
      @AuthenticationPrincipal Long userId,
      @Valid @ModelAttribute UpdateUserRequestDto dto,
      @RequestPart(required = false) MultipartFile profileImage) {

    userService.updateUser(userId, dto, profileImage);
    return ResponseEntity.ok(ApiResponseDto.success("회원정보가 수정되었습니다."));
  }
}
