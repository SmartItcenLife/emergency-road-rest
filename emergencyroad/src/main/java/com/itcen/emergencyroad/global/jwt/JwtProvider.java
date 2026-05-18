package com.itcen.emergencyroad.global.jwt;

import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtProvider {

  private final SecretKey secretKey;
  private final long accessTokenExpiry;
  private final long refreshTokenExpiry;

  public JwtProvider(
      @Value("${jwt.secret}") String secret,
      @Value("${jwt.access-token-expiry}") long accessTokenExpiry,
      @Value("${jwt.refresh-token-expiry}") long refreshTokenExpiry
  ) {
    this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshTokenExpiry = refreshTokenExpiry;
  }

  // Access Token 발급
  public String createAccessToken(Long userId, String role) {
    return Jwts.builder()
        .subject(String.valueOf(userId))
        .claim("role", role)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + accessTokenExpiry))
        .signWith(secretKey)
        .compact();
  }

  // Refresh Token 발급
  public String createRefreshToken(Long userId) {
    return Jwts.builder()
        .subject(String.valueOf(userId))
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiry))
        .signWith(secretKey)
        .compact();
  }

  // 토큰 파싱 (서명 검증 + 만료 검증)
  public Claims parseToken(String token) {
    try {
      return Jwts.parser()
          .verifyWith(secretKey)
          .build()
          .parseSignedClaims(token)
          .getPayload();
    } catch (ExpiredJwtException e) {
      throw new CustomException(ExceptionStatus.EXPIRED_TOKEN);
    } catch (MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
      throw new CustomException(ExceptionStatus.INVALID_TOKEN);
    }
  }

  public Long getUserId(String token) {
    return Long.parseLong(parseToken(token).getSubject());
  }

  public String getRole(String token) {
    return parseToken(token).get("role", String.class);
  }

  public long getRefreshTokenExpiry() {
    return refreshTokenExpiry;
  }
}
