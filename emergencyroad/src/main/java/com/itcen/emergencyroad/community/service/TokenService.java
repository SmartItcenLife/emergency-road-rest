package com.itcen.emergencyroad.community.service;

import com.itcen.emergencyroad.community.dto.auth.AuthTokenResponseDto;
import com.itcen.emergencyroad.community.entity.RefreshToken;
import com.itcen.emergencyroad.community.entity.User;
import com.itcen.emergencyroad.community.repository.RefreshTokenRepository;
import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import com.itcen.emergencyroad.global.jwt.JwtProvider;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenService {

  private final JwtProvider jwtProvider;
  private final RefreshTokenRepository refreshTokenRepository;

  @Transactional
  public AuthTokenResponseDto issueTokens(User user){
    String accessToken = jwtProvider.createAccessToken(user.getId(), String.valueOf(user.getRole()));
    String refreshToken = jwtProvider.createRefreshToken(user.getId());

    refreshTokenRepository.deleteAllByUser(user);
    refreshTokenRepository.flush();

    refreshTokenRepository.saveAndFlush(
        RefreshToken.builder()
            .user(user)
            .token(refreshToken)
            .expiresAt(LocalDateTime.now().plusSeconds(
            jwtProvider.getRefreshTokenExpiry() / 1000
        )).build()
    );

    return AuthTokenResponseDto.builder()
        .accessToken(accessToken)
        .nickname(user.getNickname())
        .refreshToken(refreshToken)
        .userId(user.getId())
        .profileImageUrl(user.getProfileImageUrl())
        .role(user.getRole().name())
        .build();
  }

  @Transactional
  public void revoke(String refreshTokenStr) {
    refreshTokenRepository.findByToken(refreshTokenStr)
        .ifPresent(refreshTokenRepository::delete);
  }

  @Transactional
  public AuthTokenResponseDto refresh(String refreshTokenStr) {
    // 1) JWT 서명 / 만료 검증
    jwtProvider.parseToken(refreshTokenStr);

    // 2) DB 조회
    RefreshToken stored = refreshTokenRepository.findByToken(refreshTokenStr)
        .orElseThrow(() -> new CustomException(ExceptionStatus.TOKEN_NOT_FOUND));

    // 3) 만료 확인
    if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new CustomException(ExceptionStatus.EXPIRED_TOKEN);
    }

    // 4) 새 토큰 쌍 발급
    return issueTokens(stored.getUser());
  }
}
