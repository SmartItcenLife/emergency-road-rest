//package com.itcen.emergencyroad.test;
//
//import com.itcen.emergencyroad.admin.dto.DashboardResponseDto;
//import com.itcen.emergencyroad.admin.service.AdminService;
//import lombok.AllArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@AllArgsConstructor
//@Transactional(readOnly = true)
//public class AdminTestService{
//    private final AdminService adminService;
//
//    @Override
//    public ResponseEntity<DashboardResponseDto> adminMain(){
//        DashboardResponseDto stats = adminService.getDashboardStats();
//    }
//}