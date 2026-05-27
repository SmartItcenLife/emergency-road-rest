package com.itcen.emergencyroad.community.controller;

import com.itcen.emergencyroad.community.service.LikeService;
import com.itcen.emergencyroad.global.common.ApiResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hospitals/{hpid}/posts/{postId}")
@RequiredArgsConstructor
public class LikeController {

  private final LikeService likeService;

  // 게시글 좋아요 토글
  @PostMapping("/like")
  public ResponseEntity<ApiResponseDto<Boolean>> togglePostLike(
      @PathVariable Long postId,
      @AuthenticationPrincipal Long userId) {

    boolean isLiked = likeService.togglePostLike(postId, userId);
    String message = isLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.";
    return ResponseEntity.ok(ApiResponseDto.success(message, isLiked));
  }

  // 댓글 좋아요 토글
  @PostMapping("/comments/{commentId}/like")
  public ResponseEntity<ApiResponseDto<Boolean>> toggleCommentLike(
      @PathVariable Long commentId,
      @AuthenticationPrincipal Long userId) {

    boolean isLiked = likeService.toggleCommentLike(commentId, userId);
    String message = isLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.";
    return ResponseEntity.ok(ApiResponseDto.success(message, isLiked));
  }
}
