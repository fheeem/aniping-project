package com.aniping.anipingapp.board.controller;

import com.aniping.anipingapp.board.dto.ChaPostResponseDto;
import com.aniping.anipingapp.board.entity.FreeBoard;
import com.aniping.anipingapp.board.service.FreeBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/board")
public class FreeBoardController {

    @Autowired
    private FreeBoardService freeBoardService;

    @GetMapping("/list")
    public ResponseEntity<Page<ChaPostResponseDto>> getList(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(freeBoardService.getBoardList(keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChaPostResponseDto> getPost(@PathVariable Integer id) {
        return ResponseEntity.ok(freeBoardService.getPost(id));
    }

    @PostMapping("/write")
    public ResponseEntity<?> write(@RequestBody FreeBoard request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String email = null;
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2User) {
            // 소셜 로그인 사용자
            email = ((OAuth2User) principal).getAttribute("email");
        } else if (principal instanceof String) {
            // 일반 로그인 사용자 (UserAPIController에서 loginId(email)를 principal로 설정함)
            email = (String) principal;
        }

        System.out.println("Controller received email: " + email);

        if (email == null) {
            return ResponseEntity.badRequest().body("사용자 정보를 찾을 수 없습니다.");
        }

        try {
            // FreeBoardService에서 boardType을 FREEBOARD로 설정하므로 여기서는 별도 설정 불필요
            FreeBoard savedPost = freeBoardService.writePost(email, request.getTitle(), request.getContent());
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            System.err.println("Error saving post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
