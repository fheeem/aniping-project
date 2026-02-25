package com.aniping.anipingapp.board.controller;

import com.aniping.anipingapp.board.entity.FreeBoard;
import com.aniping.anipingapp.board.service.FreeBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/board")
public class FreeBoardController {

    @Autowired
    private FreeBoardService freeBoardService;

    @GetMapping
    public ResponseEntity<Page<FreeBoard>> getList(Pageable pageable) {
        return ResponseEntity.ok(freeBoardService.getBoardList(pageable));
    }

    @PostMapping("/write")
    public ResponseEntity<?> write(@RequestBody FreeBoard request,
                                   @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String email = principal.getAttribute("email");
        System.out.println("Controller received email: " + email);

        if (email == null) {
            return ResponseEntity.badRequest().body("이메일 정보가 없습니다.");
        }

        try {
            FreeBoard savedPost = freeBoardService.writePost(email, request.getTitle(), request.getContent());
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            System.err.println("Error saving post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}