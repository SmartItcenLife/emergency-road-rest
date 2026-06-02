package com.itcen.emergencyroad.community.service;

import static com.itcen.emergencyroad.global.util.QueryResultUtil.toCountMap;
import com.itcen.emergencyroad.community.dto.comment.CommentRequestDto;
import com.itcen.emergencyroad.community.dto.comment.CommentResponseDto;
import com.itcen.emergencyroad.community.entity.Comment;
import com.itcen.emergencyroad.community.entity.Post;
import com.itcen.emergencyroad.community.entity.User;
import com.itcen.emergencyroad.community.enums.Role;
import com.itcen.emergencyroad.community.repository.CommentLikeRepository;
import com.itcen.emergencyroad.community.repository.CommentRepository;
import com.itcen.emergencyroad.community.repository.PostRepository;
import com.itcen.emergencyroad.community.repository.UserRepository;
import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final CommentLikeRepository commentLikeRepository;

  @Transactional(readOnly = true)
  public List<CommentResponseDto> getComments(Long postId, Long loginUserId) {

    List<Comment> comments = commentRepository
        .findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(postId);

    List<Long> commentIds = comments.stream()
        .map(Comment::getId)
        .toList();

    Map<Long, Long> likeCountMap = toCountMap(
        commentLikeRepository.countByCommentIds(commentIds));

    Set<Long> likedCommentIds = (loginUserId != null)
        ? new HashSet<>(commentLikeRepository.findLikedCommentIds(commentIds, loginUserId))
        : Set.of();

    return comments.stream()
        .map(comment -> CommentResponseDto.from(
            comment,
            likeCountMap.getOrDefault(comment.getId(), 0L),
            likedCommentIds.contains(comment.getId())
        ))
        .toList();
  }

  @Transactional
  public void createComment(Long postId, CommentRequestDto dto, Long userId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.POST_NOT_FOUND));

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

    Comment comment = Comment.builder()
        .post(post)
        .user(user)
        .content(dto.getContent())
        .build();

    commentRepository.save(comment);
  }

  @Transactional
  public void updateComment(Long commentId, CommentRequestDto dto, Long userId) {
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.COMMENT_NOT_FOUND));

    if (!Objects.equals(comment.getUser().getId(), userId)) {
      throw new CustomException(ExceptionStatus.USER_COMMENT_FORBIDDEN);
    }
    comment.update(dto.getContent());
  }

  @Transactional
  public void deleteComment(Long commentId, Long userId, String role) {
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.NOT_FOUND));

    boolean isAuthor = Objects.equals(comment.getUser().getId(), userId);
    boolean isAdmin = Role.ADMIN.name().equals(role);

    if (!isAuthor && !isAdmin) {
      throw new CustomException(ExceptionStatus.DELETE_FORBIDDEN);
    }
    comment.delete();
  }
}
