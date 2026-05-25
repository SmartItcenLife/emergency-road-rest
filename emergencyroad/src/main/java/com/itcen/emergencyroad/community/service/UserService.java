package com.itcen.emergencyroad.community.service;

import com.itcen.emergencyroad.community.dto.auth.LoginRequestDto;
import com.itcen.emergencyroad.community.dto.auth.SignupRequestDto;
import com.itcen.emergencyroad.community.dto.auth.UpdateUserRequestDto;
import com.itcen.emergencyroad.community.dto.auth.AuthTokenResponseDto;
import com.itcen.emergencyroad.community.dto.auth.UserResponseDto;
import com.itcen.emergencyroad.community.dto.kakao.KakaoUserInfoDto;
import com.itcen.emergencyroad.community.entity.User;
import com.itcen.emergencyroad.community.enums.LoginType;
import com.itcen.emergencyroad.community.enums.Role;
import com.itcen.emergencyroad.community.repository.UserRepository;
import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final KakaoService kakaoService;
  private final TokenService tokenService;
  private final ProfileImageService profileImageService;

  // 회원가입
  @Transactional
  public void signUp(SignupRequestDto dto, MultipartFile profileImage) {
    if (userRepository.existsByUserName(((dto.getUserName())))){
      throw new CustomException(ExceptionStatus.DUPLICATED_USERNAME);
    }
    if (userRepository.existsByNickname(((dto.getNickname())))){
      throw new CustomException(ExceptionStatus.DUPLICATED_NICKNAME);
    }
    if (userRepository.existsByEmail(((dto.getEmail())))){
      throw new CustomException(ExceptionStatus.DUPLICATED_EMAIL);
    }

    String encodedPw = passwordEncoder.encode(dto.getPassword());
    String profileImageUrl = null;

    if (profileImage != null && !profileImage.isEmpty()) {
      profileImageUrl = profileImageService.uploadProfileImage(profileImage);
    }

    userRepository.save(
        User.builder()
            .userName(dto.getUserName())
            .password(encodedPw)
            .nickname(dto.getNickname())
            .email(dto.getEmail())
            .profileImageUrl(profileImageUrl)
            .loginType(LoginType.LOCAL)
            .role(Role.USER)
            .build()
    );
  }

  // 로컬 로그인
  @Transactional
  public AuthTokenResponseDto login(LoginRequestDto dto) {
    User user = userRepository.findByUserName(dto.getUserName())
        .orElseThrow(() -> new CustomException(ExceptionStatus.AUTHENTICATION_FAIL));

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword()))
      throw new CustomException(ExceptionStatus.AUTHENTICATION_FAIL);

    return tokenService.issueTokens(user);
  }

  // 카카오 로그인
  @Transactional
  public AuthTokenResponseDto kakaoLogin(String code) {
    String kakaoAccessToken = kakaoService.getAccessToken(code);
    KakaoUserInfoDto kakaoUserInfo = kakaoService.getUserInfo(kakaoAccessToken);
    String kakaoId = String.valueOf(kakaoUserInfo.getId());

    User user = userRepository.findByKakaoId(kakaoId)
        .orElseGet(() -> {
          String nickname = kakaoUserInfo.getNickname();
          // 카카오 닉네임은 최대 20자 → _(1자) + UUID(9자) = 최대 30자
          if (userRepository.existsByNickname(nickname)) {
            nickname = nickname + "_" + UUID.randomUUID().toString().substring(0, 9);
          }
          return userRepository.save(
              User.builder()
                  .kakaoId(kakaoId)
                  .nickname(nickname)
                  .profileImageUrl(kakaoUserInfo.getProfileImageUrl())
                  .loginType(LoginType.KAKAO)
                  .role(Role.USER)
                  .build()
          );
        });

    user.updateKakaoProfile(kakaoUserInfo.getNickname(), kakaoUserInfo.getProfileImageUrl());
    // 카카오 accessToken은 더 이상 저장하지 않음 (자체 JWT로 대체)

    return tokenService.issueTokens(user);
  }

  // 내 정보 조회
  @Transactional(readOnly = true)
  public UserResponseDto getUser(Long userId) {
    User user =  userRepository.findById(userId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

    return UserResponseDto.from(user);
  }

  // 회원정보 수정
  @Transactional
  public void updateUser(Long userId, UpdateUserRequestDto dto, MultipartFile profileImage) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

    if (dto.getNickname() != null && !dto.getNickname().isBlank()) {
      if (!dto.getNickname().equals(user.getNickname()) &&
          userRepository.existsByNickname(dto.getNickname())) {
        throw new CustomException(ExceptionStatus.DUPLICATED_NICKNAME);
      }
      user.updateNickname(dto.getNickname());
    }

    if (profileImage != null && !profileImage.isEmpty()) {
      String imageUrl = profileImageService.uploadProfileImage(profileImage);
      user.updateProfileImage(imageUrl);
    }
  }
}
