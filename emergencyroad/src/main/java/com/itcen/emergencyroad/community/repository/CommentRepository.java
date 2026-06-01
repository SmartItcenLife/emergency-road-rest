package com.itcen.emergencyroad.community.repository;

import com.itcen.emergencyroad.community.entity.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {

  List<Comment> findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(Long postId);

  @Query("select c.post.id, count(c) from Comment c " +
      "where c.post.id in :postIds and c.isDeleted = false group by c.post.id")
  List<Object[]> countByPostIds(@Param("postIds") List<Long> postIds);

}
