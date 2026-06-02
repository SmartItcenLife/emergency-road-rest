package com.itcen.emergencyroad.community.controller;

import com.itcen.emergencyroad.community.dto.comment.CommentRequestDto;
import com.itcen.emergencyroad.community.dto.comment.CommentResponseDto;
import com.itcen.emergencyroad.community.dto.report.ReportRequestDTO;
import com.itcen.emergencyroad.community.enums.ReportTargetType;
import com.itcen.emergencyroad.community.enums.Role;
import com.itcen.emergencyroad.community.service.CommentService;
import com.itcen.emergencyroad.community.service.ReportService;
import com.itcen.emergencyroad.global.common.ApiResponseDto;
import com.itcen.emergencyroad.global.util.SecurityUtil;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospitals/{hpid}/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

  private static final String ROLE_USER = "USER";
  private static final String ROLE_PREFIX = "ROLE_";

  private final CommentService commentService;
  private final ReportService reportService;

  @GetMapping
  public ResponseEntity<ApiResponseDto<List<CommentResponseDto>>> getComments(
      @PathVariable Long postId,
      @AuthenticationPrincipal Long userId) {

    return ResponseEntity.ok(
        ApiResponseDto.success("댓글 목록 조회 성공",
            commentService.getComments(postId, userId))
    );
  }

  @PostMapping
  public ResponseEntity<ApiResponseDto<Void>> createComment(
      @PathVariable Long postId,
      @Valid @RequestBody CommentRequestDto dto,
      @AuthenticationPrincipal Long userId) {

    commentService.createComment(postId, dto, userId);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponseDto.success("댓글이 작성되었습니다."));
  }

  @PutMapping("/{commentId}")
  public ResponseEntity<ApiResponseDto<Void>> updateComment(
      @PathVariable Long commentId,
      @Valid @RequestBody CommentRequestDto dto,
      @AuthenticationPrincipal Long userId) {

    commentService.updateComment(commentId, dto, userId);
    return ResponseEntity.ok(ApiResponseDto.success("댓글이 수정되었습니다."));
  }

  @DeleteMapping("/{commentId}")
  public ResponseEntity<ApiResponseDto<Void>> deleteComment(
      @PathVariable Long commentId,
      @AuthenticationPrincipal Long userId) {

    commentService.deleteComment(commentId, userId, SecurityUtil.getCurrentUserRole());
    return ResponseEntity.ok(ApiResponseDto.success("댓글이 삭제되었습니다."));
  }

  private String getCurrentUserRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null) {
      return String.valueOf(Role.USER);
    }

    return auth.getAuthorities().stream()
        .findFirst()
        .map(a -> a.getAuthority().replace(ROLE_PREFIX, ""))
        .orElse(ROLE_USER);
  }

  // 댓글 신고 접수
  @PostMapping("/{commentId}/report")
  public ResponseEntity<ApiResponseDto<Void>> reportComment(
          @PathVariable String hpid,
          @PathVariable Long postId,
          @PathVariable Long commentId, // 타겟 번호가 댓글 번호임
          @Valid @RequestBody ReportRequestDTO requestDTO,
          @AuthenticationPrincipal Long userId) {

    if(userId == null){
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(ApiResponseDto.fail(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다"));
    }

    reportService.createReport(
            userId,
            ReportTargetType.COMMENT,
            commentId,
            requestDTO.getReason(),
            hpid
    );

    return ResponseEntity.ok(ApiResponseDto.success("댓글 신고가 접수되었습니다."));
  }
}
