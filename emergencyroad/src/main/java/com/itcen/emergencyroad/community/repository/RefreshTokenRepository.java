package com.itcen.emergencyroad.community.repository;

import com.itcen.emergencyroad.community.entity.RefreshToken;
import com.itcen.emergencyroad.community.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

  Optional<RefreshToken> findByToken(String token);

  void deleteAllByUser(User user);
}
