package com.aniping.anipingapp.board.service;

import com.aniping.anipingapp.board.entity.FreeBoard;
import com.aniping.anipingapp.board.repository.FreeBoardRepository;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FreeBoardService {

    @Autowired
    private FreeBoardRepository freeBoardRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<FreeBoard> getBoardList(Pageable pageable) {
        return freeBoardRepository.findAll(pageable);
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

        FreeBoard saved = freeBoardRepository.save(post);
        System.out.println("Post saved successfully. ID: " + saved.getId());
        return saved;
    }
}