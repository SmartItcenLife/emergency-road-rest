package com.itcen.emergencyroad.community.repository;

import com.itcen.emergencyroad.community.entity.CommentLike;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

  @Query("select cl.comment.id, count(cl) from CommentLike cl " +
      "where cl.comment.id in :commentIds group by cl.comment.id")
  List<Object[]> countByCommentIds(@Param("commentIds") List<Long> commentIds);

  @Query("select cl.comment.id from CommentLike cl " +
          "where cl.comment.id in :commentIds and cl.user.id = :userId")
  List<Long> findLikedCommentIds(@Param("commentIds") List<Long> commentIds,
      @Param("userId") Long userId);
  void deleteByComment_IdAndUser_Id(Long commentId, Long userId);

  boolean existsByComment_IdAndUser_Id(Long commentId, Long userId);
}
