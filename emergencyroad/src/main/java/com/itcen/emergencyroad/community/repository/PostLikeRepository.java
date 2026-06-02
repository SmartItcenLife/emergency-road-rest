package com.itcen.emergencyroad.community.repository;

import com.itcen.emergencyroad.community.entity.PostLike;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

  @Query("select pl.post.id, count(pl) from PostLike pl " +
        "where pl.post.id in :postIds group by pl.post.id")
  List<Object[]> countByPostIds(@Param("postIds") List<Long> postIds);

  boolean existsByPost_IdAndUser_Id(Long postId, Long userId);

  void deleteByPost_IdAndUser_Id(Long postId, Long userId);

  long countByPost_Id(Long postId);
}
