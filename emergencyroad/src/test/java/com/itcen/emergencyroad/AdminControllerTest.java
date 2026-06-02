package com.itcen.emergencyroad;

import com.itcen.emergencyroad.admin.controller.AdminController;
import com.itcen.emergencyroad.admin.dto.AdminPostListDTO;
import com.itcen.emergencyroad.admin.dto.AdminUserResponseDTO;
import com.itcen.emergencyroad.admin.dto.DashboardResponseDto;
import com.itcen.emergencyroad.admin.service.AdminService;
import com.itcen.emergencyroad.community.dto.report.ReportResponseDTO;
import com.itcen.emergencyroad.community.enums.ReportTargetType;
import com.itcen.emergencyroad.global.jwt.JwtProvider;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @MockitoBean
    private AdminService adminService;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtProvider jwtProvider;

    @BeforeEach
    public void before(){
        System.out.println("Test Before");
    }

    @AfterEach
    public void after(){
        System.out.println("Test After");
    }

    @Test
    @WithMockUser(roles="ADMIN")
    @DisplayName("메인 페이지 대시보드 정보 가져오기 성공")
    void adminMain() throws Exception {
        DashboardResponseDto stats =
                new DashboardResponseDto(10L, 20L, 30L);

        given(adminService.getDashboardStats()).willReturn(stats);

        mockMvc.perform(get("/api/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.todayUsers").value(10))
                .andExpect(jsonPath("$.todayPosts").value(20))
                .andExpect(jsonPath("$.totalReports").value(30));

        verify(adminService).getDashboardStats();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("회원 목록 보기")
    void getUserList() throws Exception {
        AdminUserResponseDTO user = mock(AdminUserResponseDTO.class);

        given(adminService.findAllUsers()).willReturn(List.of(user));

        mockMvc.perform(get("/api/admin/users"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$").isArray())
                        .andExpect(jsonPath("$.length()").value(1));

        verify(adminService).findAllUsers();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("회원 삭제하기")
    void deleteUser() throws Exception{
        Long userId = 1L;

        mockMvc.perform(delete("/api/admin/users/{id}", userId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(adminService).deleteUser(userId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("커뮤니티 글 목록 조회하기")
    void getPostList() throws Exception{
        AdminPostListDTO post = mock(AdminPostListDTO.class);

        given(adminService.findAllPosts()).willReturn(List.of(post));

       mockMvc.perform(get("/api/admin/posts"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$").isArray())
               .andExpect(jsonPath("$.length()").value(1));

       verify(adminService).findAllPosts();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("커뮤니티 글 삭제하기")
    void deletePost() throws Exception{
        Long postId = 1L;

        mockMvc.perform(delete("/api/admin/users/{id}", postId)
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(adminService).deleteUser(postId);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("신고글과 신고 댓글 목록 보기")
    void getReportedList() throws Exception{
        ReportResponseDTO postReport = mock(ReportResponseDTO.class);
        ReportResponseDTO commentReport = mock(ReportResponseDTO.class);

        given(postReport.getTargetType()).willReturn(ReportTargetType.POST);
        given(commentReport.getTargetType()).willReturn(ReportTargetType.COMMENT);

        given(adminService.findAllReports()).willReturn(List.of(postReport, commentReport));

        mockMvc.perform(get("/api/admin/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.postReportList").isArray())
                .andExpect(jsonPath("$.postReportList.length()").value(1))
                .andExpect(jsonPath("$.commentReportList").isArray())
                .andExpect(jsonPath("$.commentReportList.length()").value(1));

        verify(adminService).findAllReports();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("신고된 게시글/댓글 삭제 처리")
    void deleteReportedTarget() throws Exception{
        Long reportId = 1L;

        mockMvc.perform(delete("/api/admin/reports/{reportId}", reportId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(adminService).deleteReportedTarget(reportId);
    }

}