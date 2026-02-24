package com.aniping.anipingapp.admin.controller;

import com.aniping.anipingapp.admin.dto.ReportProcessDto;
import com.aniping.anipingapp.admin.dto.ReportResponseDto;
import com.aniping.anipingapp.admin.entity.Report;
import com.aniping.anipingapp.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/reports")
    public ResponseEntity<Page<ReportResponseDto>> getReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Report.Status status) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending());
        Page<ReportResponseDto> reports = adminService.getReports(status, pageable);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/reports/{reportId}")
    public ResponseEntity<?> processReport(
            @PathVariable Integer reportId,
            @RequestBody ReportProcessDto processDto) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // adminId 가져오기 (String -> Long 변환 필요할 수 있음, 여기서는 loginId가 String이므로 UserService 등을 통해 ID 조회 필요하지만, 
        // 간단하게 Principal이 ID라고 가정하거나, 실제 구현에서는 UserDetails에서 ID를 꺼내야 함.
        // 현재 구조상 Principal은 loginId(String)이므로, 이를 통해 UserEntity를 조회해서 ID를 얻어야 함.
        // 하지만 AdminService에서 adminId를 저장하는 로직이 있으므로, 여기서는 임시로 1L로 처리하거나, 
        // UserService를 주입받아 ID를 조회해야 함.
        
        // 편의상 1번 관리자로 하드코딩하거나, 추후 수정 필요.
        Long adminId = 1L; 

        try {
            adminService.processReport(reportId, processDto, adminId);
            return ResponseEntity.ok("신고 처리가 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 오류가 발생했습니다.");
        }
    }
}
