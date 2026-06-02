package com.itcen.emergencyroad.community.repository;

import com.itcen.emergencyroad.community.entity.PostImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {

  List<PostImage> findByPost_IdInOrderByCreatedAtAsc(List<Long> postIds);

  void deleteByPost_Id(Long postId);
}
