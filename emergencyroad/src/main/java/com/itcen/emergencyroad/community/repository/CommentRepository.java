package com.itcen.emergencyroad.community.repository;

import com.itcen.emergencyroad.community.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

  List<Comment> findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(Long postId);

  @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId AND c.isDeleted = false")
  long countByPostIdAndIsDeletedFalse(@Param("postId") Long postId);
}
