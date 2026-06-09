package com.itcen.emergencyroad.admin.service;

import com.itcen.emergencyroad.admin.dto.AdminPostListDTO;
import com.itcen.emergencyroad.admin.dto.AdminUserResponseDTO;
import com.itcen.emergencyroad.admin.dto.DashboardResponseDto;
import com.itcen.emergencyroad.community.dto.report.ReportResponseDTO;
import com.itcen.emergencyroad.community.entity.Comment;
import com.itcen.emergencyroad.community.entity.Post;
import com.itcen.emergencyroad.community.entity.Report;
import com.itcen.emergencyroad.community.entity.User;
import com.itcen.emergencyroad.community.enums.ReportTargetType;
import com.itcen.emergencyroad.community.repository.CommentLikeRepository;
import com.itcen.emergencyroad.community.repository.CommentRepository;
import com.itcen.emergencyroad.community.repository.PostLikeRepository;
import com.itcen.emergencyroad.community.repository.PostRepository;
import com.itcen.emergencyroad.community.repository.RefreshTokenRepository;
import com.itcen.emergencyroad.community.repository.ReportRepository;
import com.itcen.emergencyroad.community.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;
    private final CommentRepository commentRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentLikeRepository commentLikeRepository;

    // 전체 회원 목록 조회
    public List<AdminUserResponseDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserResponseDTO::new) // Entity -> DTO 변환
                .collect(Collectors.toList());
    }
    // 사용자 삭제하기
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // ① 리프레시 토큰 삭제
        refreshTokenRepository.deleteAllByUser(user);

        // ② 유저가 누른 좋아요 삭제
        postLikeRepository.deleteAllByUser(user);
        commentLikeRepository.deleteAllByUser(user);

        // ③ 유저가 작성한 신고 삭제
        reportRepository.deleteAllByReporter(user);

        // ④ 유저의 게시글 및 게시글에 달린 모든 연관 데이터 삭제
        List<Post> userPosts = postRepository.findAllByUser(user);
        for (Post post : userPosts) {
            List<Comment> postComments = commentRepository.findAllByPost(post);
            for (Comment comment : postComments) {
                reportRepository.deleteAllByTargetTypeAndTargetId(ReportTargetType.COMMENT, comment.getId());
                commentLikeRepository.deleteAllByComment(comment);
            }
            commentRepository.deleteAll(postComments);
            postLikeRepository.deleteAllByPost(post);
            reportRepository.deleteAllByTargetTypeAndTargetId(ReportTargetType.POST, post.getId());
        }
        postRepository.deleteAll(userPosts);

        // ⑤ 유저의 나머지 댓글(다른 사람 게시글에 작성한 것) 삭제
        List<Comment> userComments = commentRepository.findAllByUser(user);
        for (Comment comment : userComments) {
            reportRepository.deleteAllByTargetTypeAndTargetId(ReportTargetType.COMMENT, comment.getId());
            commentLikeRepository.deleteAllByComment(comment);
        }
        commentRepository.deleteAll(userComments);

        // ⑥ 유저 삭제
        userRepository.delete(user);
    }

    // 관리자용 전체 게시글 목록 조회(최신순)
    public List<AdminPostListDTO> findAllPosts(){
        return postRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(AdminPostListDTO::new)
                .collect(Collectors.toList());
    }
    // 게시글 삭제하기
    @Transactional
    public void deletePost(Long id){
        Post post = postRepository.findById(id)
                        .orElseThrow(()->new IllegalArgumentException("해당 게시글이 존재하지 않습니다"));
        post.delete();
    }

    // 신고받은 게시글, 댓글 관리하기
    // AdminService.java 내부
    // 신고받은 게시글, 댓글 관리하기 (상태값 포함)
    public List<ReportResponseDTO> findAllReports() {
        List<Report> reports = reportRepository.findAll();

        return reports.stream().map(report -> {
            boolean isDeleted = false;
            Long postId = null;
            String hpid = report.getHpid(); // 기본값

            if (report.getTargetType() == ReportTargetType.POST) {
                Post post = postRepository.findById(report.getTargetId()).orElse(null);
                isDeleted = (post == null || post.isDeleted());
                postId = report.getTargetId();
                if (post != null) hpid = post.getHospital().getHpid(); // 🔥 Post에서 확실하게 hpid 가져오기
            }
            else if (report.getTargetType() == ReportTargetType.COMMENT) {
                Comment comment = commentRepository.findById(report.getTargetId()).orElse(null);
                isDeleted = (comment == null || comment.isDeleted());
                if (comment != null && comment.getPost() != null) {
                    postId = comment.getPost().getId();
                    hpid = comment.getPost().getHospital().getHpid(); // 🔥 Comment의 원본 Post에서 hpid 가져오기
                }
            }

            // 변경된 생성자에 맞춰 파라미터 4개를 던져줍니다.
            return new ReportResponseDTO(report, isDeleted, postId, hpid);
        }).collect(Collectors.toList());
    }

    @Transactional
    public void deleteReportedTarget(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("해당 신고 내역을 찾을 수 없습니다."));

        if (report.getTargetType() == ReportTargetType.POST) {
            Post post = postRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시글을 찾을 수 없습니다."));
            post.delete();
        }
        else if (report.getTargetType() == ReportTargetType.COMMENT) {
            Comment comment = commentRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 댓글을 찾을 수 없습니다."));
            comment.delete();
        }

    }

    @Transactional(readOnly = true)
    public DashboardResponseDto getDashboardStats() {
        // 오늘 00시 00분 00초 구하기
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();

        // 1. 오늘 가입한 회원 수
        long todayUsers = userRepository.countByCreatedAtAfter(startOfDay);

        // 2. 오늘 새 게시글 수
        long todayPosts = postRepository.countByCreatedAtAfter(startOfDay);

        // 3. 현재 총 신고 접수 건수
        long totalReports = reportRepository.count();

        return new DashboardResponseDto(todayUsers, todayPosts, totalReports);
    }

}
