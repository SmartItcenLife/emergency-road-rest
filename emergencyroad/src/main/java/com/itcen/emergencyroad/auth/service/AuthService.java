package com.itcen.emergencyroad.auth.service;

import com.itcen.emergencyroad.auth.dto.AuthTokenResponseDto;
import com.itcen.emergencyroad.auth.dto.LoginRequestDto;
import com.itcen.emergencyroad.auth.dto.SignupRequestDto;
import com.itcen.emergencyroad.auth.dto.kakao.KakaoUserInfoDto;
import com.itcen.emergencyroad.community.entity.User;
import com.itcen.emergencyroad.community.enums.LoginType;
import com.itcen.emergencyroad.community.enums.Role;
import com.itcen.emergencyroad.community.repository.UserRepository;
import com.itcen.emergencyroad.community.service.ProfileImageService;
import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final KakaoService kakaoService;
  private final TokenService tokenService;
  private final ProfileImageService profileImageService;

  @Transactional
  public void signUp(SignupRequestDto dto, MultipartFile profileImage) {
    if (userRepository.existsByUserName(dto.getUserName())) {
      throw new CustomException(ExceptionStatus.DUPLICATED_USERNAME);
    }
    if (userRepository.existsByNickname(dto.getNickname())) {
      throw new CustomException(ExceptionStatus.DUPLICATED_NICKNAME);
    }
    if (userRepository.existsByEmail(dto.getEmail())) {
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

  @Transactional
  public AuthTokenResponseDto login(LoginRequestDto dto) {
    User user = userRepository.findByUserName(dto.getUserName())
        .orElseThrow(() -> new CustomException(ExceptionStatus.AUTHENTICATION_FAIL));

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
      throw new CustomException(ExceptionStatus.AUTHENTICATION_FAIL);
    }

    return tokenService.issueTokens(user);
  }

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

    return tokenService.issueTokens(user);
  }
}
