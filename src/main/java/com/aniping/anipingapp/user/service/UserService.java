package com.aniping.anipingapp.user.service;

import com.aniping.anipingapp.user.dto.UserJoinDto;
import com.aniping.anipingapp.user.dto.UserLoginDto;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserEntity join(UserJoinDto userJoinDto) {
        // ID 중복 검사
        if (userRepository.findByLoginId(userJoinDto.getLoginId()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        // 닉네임 중복 검사
        if (userRepository.findByNickname(userJoinDto.getNickname()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userJoinDto.getPassword());
        UserEntity userEntity = userJoinDto.toEntity(encodedPassword);

        return userRepository.save(userEntity);
    }

    public boolean login(UserLoginDto userLoginDto, HttpSession session) {
        System.out.println("로그인 시도 ID: " + userLoginDto.getLoginId());
        
        UserEntity user = userRepository.findByLoginId(userLoginDto.getLoginId())
                .orElse(null);

        if (user == null) {
            System.out.println("사용자를 찾을 수 없음");
            return false;
        }

        System.out.println("DB 비밀번호(Hash): " + user.getPassword());
        System.out.println("입력 비밀번호: " + userLoginDto.getPassword());
        
        boolean matches = passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword());
        System.out.println("비밀번호 일치 여부: " + matches);

        if (matches) {
            session.setAttribute("user", user);
            return true;
        }
        return false;
    }
}
