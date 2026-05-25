package com.itcen.emergencyroad.community.repository;

import com.itcen.emergencyroad.community.entity.PostLike;
import com.itcen.emergencyroad.community.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

  long countByPost_Id(Long postId);

  boolean existsByPost_IdAndUser_Id(Long postId, Long userId);

  void deleteByPost_IdAndUser_Id(Long postId, Long userId);

  Long user(User user);
}
