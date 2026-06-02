package com.itcen.emergencyroad.community.service;

import static com.itcen.emergencyroad.global.util.QueryResultUtil.toCountMap;
import com.itcen.emergencyroad.community.dto.post.PostRequestDto;
import com.itcen.emergencyroad.community.dto.post.PostResponseDto;
import com.itcen.emergencyroad.community.entity.Post;
import com.itcen.emergencyroad.community.entity.User;
import com.itcen.emergencyroad.community.enums.Role;
import com.itcen.emergencyroad.community.repository.CommentRepository;
import com.itcen.emergencyroad.community.repository.PostLikeRepository;
import com.itcen.emergencyroad.community.repository.PostRepository;
import com.itcen.emergencyroad.community.repository.UserRepository;
import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import com.itcen.emergencyroad.hospital.repository.HospitalRepository;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class PostService {

  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final HospitalRepository hospitalRepository;
  private final PostImageService postImageService;
  private final PostLikeRepository postLikeRepository;
  private final CommentRepository commentRepository;

  @Transactional(readOnly = true)
  public Page<PostResponseDto> getPosts(String hpid, int page, String keyword) {
    Pageable pageable = PageRequest.of(page, 10, Sort.by(Direction.DESC, "createdAt"));

    Page<Post> posts = (keyword != null && !keyword.isBlank())
        ? postRepository.searchByHospitalId(hpid, keyword, pageable)
        : postRepository.findByHospitalHpidAndIsDeletedFalse(hpid, pageable);

    List<Long> postIds = posts.stream()
        .map(Post::getId)
        .toList();

    Map<Long, List<String>> imageUrlMap = postImageService.getImageUrlMap(postIds);
    Map<Long, Long> likeCountMap = toCountMap(postLikeRepository.countByPostIds(postIds));
    Map<Long, Long> commentCountMap = toCountMap(commentRepository.countByPostIds(postIds));

    return  posts.map(post -> PostResponseDto.from(
        post,
        imageUrlMap.getOrDefault(post.getId(), List.of()),
        likeCountMap.getOrDefault(post.getId(), 0L),
        commentCountMap.getOrDefault(post.getId(), 0L),
        false
    ));
  }

  @Transactional(readOnly = true)
  public PostResponseDto getPost(Long postId, Long userId) {
    Post post = postRepository.findById(postId).orElseThrow(() -> new CustomException(ExceptionStatus.POST_NOT_FOUND));

    // 해당 조건문이 존재하면, 삭제된 게시글은 관리자인지 확인하기 전에 예외가 발생함
    // -> 관리자가 삭제된 게시글 확인 못하게 됨
    // 그래서 주석 처리 했습니다_정연
//    if(post.isDeleted()){
//      throw new CustomException(ExceptionStatus.POST_NOT_FOUND);
//    }

    List<Long> postIds = List.of(postId);

    List<String> imageUrls = postImageService.getImageUrlMap(postIds)
        .getOrDefault(postId, List.of());

    long postLikeCount = postLikeRepository.countByPost_Id(postId);
    long commentCount = commentRepository.countByPost_IdAndIsDeletedFalse(postId);

    boolean isLiked = (userId != null) &&
        postLikeRepository.existsByPost_IdAndUser_Id(postId, userId);

    return PostResponseDto.from(post, imageUrls, postLikeCount, commentCount, isLiked);
  }

  @Transactional
  public void createPost(String hpid, PostRequestDto dto, Long userId,
      List<MultipartFile> images) {
    User user = userRepository.findById(userId).orElseThrow(
        () -> new CustomException(ExceptionStatus.NOT_FOUND));

    Hospital hospital = hospitalRepository.findByHpid(hpid).orElseThrow(
        () -> new CustomException(ExceptionStatus.NOT_FOUND));

    Post post = Post.builder()
        .user(user)
        .hospital(hospital)
        .title(dto.getTitle())
        .content(dto.getContent())
        .build();

    postRepository.save(post);
    postImageService.uploadImages(post, images);
  }

  @Transactional
  public void updatePost(Long postId, PostRequestDto dto, Long userId,
      List<MultipartFile> images) {

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.POST_NOT_FOUND));

    if (!Objects.equals(post.getUser().getId(), userId)) {
      throw new CustomException(ExceptionStatus.USER_POST_FORBIDDEN);
    }

    post.update(dto.getTitle(), dto.getContent());

    postImageService.deleteImages(postId);
    postImageService.uploadImages(post, images);
  }

  @Transactional
  public void deletePost(Long postId, Long userId, String role) {
    Post post = postRepository.findById(postId).orElseThrow(() -> new CustomException(ExceptionStatus.POST_NOT_FOUND));

    boolean isAuthor = Objects.equals(post.getUser().getId(), userId);
    boolean isAdmin = Role.ADMIN.name().equals(role);

    if (!isAdmin && !isAuthor) {
      throw new CustomException(ExceptionStatus.DELETE_FORBIDDEN);
    }

    postImageService.deleteImages(postId);
    post.delete();
  }
}
