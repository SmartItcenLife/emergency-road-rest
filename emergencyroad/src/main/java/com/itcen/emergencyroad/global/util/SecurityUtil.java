package com.itcen.emergencyroad.global.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

  private static final String ROLE_PREFIX = "ROLE_";
  private static final String DEFAULT_ROLE = "USER";

  public static String getCurrentUserRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null) return DEFAULT_ROLE;
    return auth.getAuthorities().stream()
        .findFirst()
        .map(a -> a.getAuthority().replace(ROLE_PREFIX, ""))
        .orElse(DEFAULT_ROLE);
  }
}
