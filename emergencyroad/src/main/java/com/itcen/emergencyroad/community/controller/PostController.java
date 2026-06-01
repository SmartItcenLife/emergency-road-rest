package com.itcen.emergencyroad.community.controller;

import com.itcen.emergencyroad.community.dto.post.ReportRequestDTO;
import com.itcen.emergencyroad.community.dto.post.PostRequestDto;
import com.itcen.emergencyroad.community.dto.post.PostResponseDto;
import com.itcen.emergencyroad.community.enums.ReportTargetType;
import com.itcen.emergencyroad.community.enums.Role;
import com.itcen.emergencyroad.community.service.PostService;
import com.itcen.emergencyroad.community.service.ReportService;
import com.itcen.emergencyroad.global.common.ApiResponseDto;
import jakarta.validation.Valid;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/hospitals/{hpid}/posts")
@RequiredArgsConstructor
public class PostController {

  private static final String USER = "USER";
  private static final String ROLE_PREFIX = "ROLE_";

  private final PostService postService;
  private final ReportService reportService;

  // 게시글 목록 조회 (비로그인 허용)
  @GetMapping
  public ResponseEntity<ApiResponseDto<Page<PostResponseDto>>> getPosts(
      @PathVariable String hpid,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(required = false) String keyword) {

    return ResponseEntity.ok(
        ApiResponseDto.success("게시글 목록 조회 성공",
            postService.getPosts(hpid, page, keyword))
    );
  }

  // 게시글 상세 조회 (비로그인 허용)
  @GetMapping("/{postId}")
  public ResponseEntity<ApiResponseDto<PostResponseDto>> getPost(
      @PathVariable String hpid,
      @PathVariable Long postId,
      @AuthenticationPrincipal Long userId) {

    PostResponseDto post = postService.getPost(postId, userId);

    if (post.isDeleted()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(ApiResponseDto.fail(HttpStatus.NOT_FOUND, "삭제된 게시글입니다."));
    }

    return ResponseEntity.ok(ApiResponseDto.success("게시글 조회 성공", post));
  }

  // 게시글 작성 (로그인 필요)
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ApiResponseDto<Void>> createPost(
      @PathVariable String hpid,
      @Valid @ModelAttribute PostRequestDto dto,
      @RequestPart(required = false) List<MultipartFile> images,
      @AuthenticationPrincipal Long userId) {

    postService.createPost(hpid, dto, userId, images);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponseDto.success("게시글이 작성되었습니다."));
  }

  // 게시글 수정
  @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ApiResponseDto<Void>> updatePost(
      @PathVariable String hpid,
      @PathVariable Long postId,
      @Valid @ModelAttribute PostRequestDto dto,
      @RequestPart(required = false) List<MultipartFile> images,
      @AuthenticationPrincipal Long userId) {

    postService.updatePost(postId, dto, userId, images);
    return ResponseEntity.ok(ApiResponseDto.success("게시글이 수정되었습니다."));
  }

  // 게시글 삭제
  @DeleteMapping("/{postId}")
  public ResponseEntity<ApiResponseDto<Void>> deletePost(
      @PathVariable String hpid,
      @PathVariable Long postId,
      @AuthenticationPrincipal Long userId) {

    postService.deletePost(postId, userId, getCurrentUserRole());
    return ResponseEntity.ok(ApiResponseDto.success("게시글이 삭제되었습니다."));
  }

  private String getCurrentUserRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null) {
      return String.valueOf(Role.USER);
    }

    return auth.getAuthorities().stream()
        .findFirst()
        .map(a -> a.getAuthority().replace(ROLE_PREFIX, ""))
        .orElse(USER);
  }

  // 게시글 신고 접수
  @PostMapping("/{postId}/report")
  public ResponseEntity<ApiResponseDto<Void>> reportPost(
          @PathVariable String hpid,
          @PathVariable Long postId,
          @Valid @RequestBody ReportRequestDTO requestDto,
          @AuthenticationPrincipal Long userId) {

    if (userId == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(ApiResponseDto.fail(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
    }

    reportService.createReport(
            userId,
            ReportTargetType.POST,
            postId,
            requestDto.getReason(),
            hpid
    );

    return ResponseEntity.ok(ApiResponseDto.success("게시글 신고가 접수되었습니다."));
  }
}
