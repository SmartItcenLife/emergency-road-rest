package com.itcen.emergencyroad.global.util;

import com.itcen.emergencyroad.global.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtil {

  private final JwtProvider jwtProvider;

  public void addRefreshCookie(HttpServletResponse response, String token) {
    ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
        .httpOnly(true)
        .path("/api/auth")
        .maxAge(jwtProvider.getRefreshTokenExpiry() / 1000)
        .sameSite("Lax")
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }

  public void clearRefreshCookie(HttpServletResponse response) {
    ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
        .httpOnly(true)
        .path("/api/auth")
        .maxAge(0)
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}
