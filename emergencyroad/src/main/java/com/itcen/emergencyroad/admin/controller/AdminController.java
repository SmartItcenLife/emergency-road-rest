package com.itcen.emergencyroad.admin.controller;

import com.itcen.emergencyroad.admin.dto.AdminPostListDTO;
import com.itcen.emergencyroad.admin.dto.AdminUserResponseDTO;
import com.itcen.emergencyroad.admin.dto.DashboardResponseDto;
import com.itcen.emergencyroad.community.dto.report.ReportResponseDTO;
import org.springframework.http.ResponseEntity;
import com.itcen.emergencyroad.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // 메인 페이지 대시보드
    @GetMapping({"", "/"})
    public ResponseEntity<DashboardResponseDto> adminMain() {
        DashboardResponseDto stats = adminService.getDashboardStats();

        return ResponseEntity.ok(stats); // 화면 대신 데이터와 상태 코드 반환
    }

    // 회원 목록 보기
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponseDTO>> getUserList(){
        return ResponseEntity.ok(adminService.findAllUsers());
    }
    // 회원 삭제하기
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    //  커뮤니티 글 목록 조회
    @GetMapping("/posts")
    public ResponseEntity<List<AdminPostListDTO>> getPostList(){
        return ResponseEntity.ok(adminService.findAllPosts());
    }
    //커뮤니티 글 삭제하기
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id){
        adminService.deletePost(id);
        return ResponseEntity.ok().build();
    }
    // 커뮤니티 제목 누르면 상세 페이지 들어가기
    // 이건 세빈님 코드에 구현되어 있음.

     //신고글/댓글 목록 보기 (게시글/댓글 분리 버전!)
    @GetMapping("/reports")
    public ResponseEntity<Map<String, List<ReportResponseDTO>>> getReportedList(){
        List<ReportResponseDTO> allReports = adminService.findAllReports();

        // 1. 게시글 신고만 필터링
        List<ReportResponseDTO> postReports = allReports.stream()
                .filter(r -> r.getTargetType() == com.itcen.emergencyroad.community.enums.ReportTargetType.POST)
                .collect(Collectors.toList());

        // 2. 댓글 신고만 필터링
        List<ReportResponseDTO> commentReports = allReports.stream()
                .filter(r -> r.getTargetType() == com.itcen.emergencyroad.community.enums.ReportTargetType.COMMENT)
                .collect(Collectors.toList());

        Map<String, List<ReportResponseDTO>> responseData = new HashMap<>();

        responseData.put("postReportList", postReports);
        responseData.put("commentReportList", commentReports);

        return ResponseEntity.ok(responseData);
    }

    // 신고된 게시글/댓글 강제 삭제 처리
    @DeleteMapping("/reports/{reportId}")
    public ResponseEntity<Void> deleteReportedTarget(@PathVariable Long reportId) {
        adminService.deleteReportedTarget(reportId);
        return ResponseEntity.ok().build(); // 삭제 후 다시 신고 목록으로 새로고침
    }


}
