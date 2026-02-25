package com.aniping.anipingapp.board.service;

import com.aniping.anipingapp.board.dto.ChaPostResponseDto;
import com.aniping.anipingapp.board.entity.FreeBoard;
import com.aniping.anipingapp.board.repository.FreeBoardRepository;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FreeBoardService {

    @Autowired
    private FreeBoardRepository freeBoardRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ChaPostResponseDto> getBoardList(String keyword, Pageable pageable) {
        List<ChaPostResponseDto> combinedList = new java.util.ArrayList<>();

        // 1. 공지사항 조회 (첫 페이지일 때만)
        if (pageable.getPageNumber() == 0) {
            List<FreeBoard> notifications = freeBoardRepository.findNotifications();
            List<ChaPostResponseDto> notificationDtos = notifications.stream()
                    .map(ChaPostResponseDto::from)
                    .collect(Collectors.toList());
            combinedList.addAll(notificationDtos);
        }

        // 2. 일반 게시글 조회 (페이징 및 검색 적용)
        Page<FreeBoard> freeBoardsPage = freeBoardRepository.findAllFreeBoardByKeyword(keyword, pageable);
        List<ChaPostResponseDto> freeBoardDtos = freeBoardsPage.getContent().stream()
                .map(ChaPostResponseDto::from)
                .collect(Collectors.toList());

        // 3. 리스트 합치기
        combinedList.addAll(freeBoardDtos);

        // Page 객체 반환
        // totalElements는 일반 게시글 수만 반환하여 페이징 계산이 일반 게시글 기준으로 동작하도록 함.
        return new PageImpl<>(combinedList, pageable, freeBoardsPage.getTotalElements());
    }

    @Transactional
    public FreeBoard writePost(String email, String title, String content) {
        System.out.println("Service attempt - Email: " + email);

        UserEntity user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    System.out.println("User not found in DB for email: " + email);
                    return null;
                });

        if (user == null) {
            throw new RuntimeException("User not found: " + email);
        }

        FreeBoard post = new FreeBoard();
        post.setUser(user);
        post.setTitle(title);
        post.setContent(content);
        post.setViews(0);
        post.setLikes(0);
        post.setBoardType(FreeBoard.BoardType.FREEBOARD); // 기본적으로 일반 게시글로 설정

        FreeBoard saved = freeBoardRepository.save(post);
        System.out.println("Post saved successfully. ID: " + saved.getId());
        return saved;
    }

    @Transactional
    public ChaPostResponseDto getPost(Integer id) {
        FreeBoard post = freeBoardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        
        // 조회수 증가
        post.setViews(post.getViews() + 1);
        
        return ChaPostResponseDto.from(post);
    }
}
