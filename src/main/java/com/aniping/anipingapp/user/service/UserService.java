package com.aniping.anipingapp.user.service;

import com.aniping.anipingapp.user.dto.UserJoinDto;
import com.aniping.anipingapp.user.dto.UserLoginDto;
import com.aniping.anipingapp.user.dto.UserUpdateDto;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserEntity join(UserJoinDto userJoinDto) {
        if (userRepository.existsByLoginId(userJoinDto.getLoginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByNickname(userJoinDto.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userJoinDto.getPassword());
        UserEntity userEntity = userJoinDto.toEntity(encodedPassword);

        return userRepository.save(userEntity);
    }

    public UserEntity authenticate(UserLoginDto userLoginDto) {
        UserEntity user = userRepository.findByLoginId(userLoginDto.getLoginId())
                .orElseThrow(() -> new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다."));

        if (!passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        if (user.getDeleteAt() != null) {
            throw new BadCredentialsException("이미 탈퇴된 계정입니다.");
        }

        return user;
    }

    @Transactional(readOnly = true)
    public Optional<UserEntity> getUserByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId);
    }

    @Transactional
    public UserEntity updateUser(String loginId, UserUpdateDto userUpdateDto) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        userRepository.findByNickname(userUpdateDto.getNickname()).ifPresent(u -> {
            if (!u.getLoginId().equals(loginId)) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }
        });

        user.setNickname(userUpdateDto.getNickname());
        user.setPhoneNumber(userUpdateDto.getPhone());
        user.setAge(userUpdateDto.getAge());
        user.setBestAni(userUpdateDto.getFavoriteAni());

        return userRepository.save(user);
    }
    
    public boolean checkPassword(String loginId, String rawPassword) {
        return userRepository.findByLoginId(loginId)
                .map(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                .orElse(false);
    }

    @Transactional
    public void changePassword(String loginId, String newPassword) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void withdrawUser(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        // 나노초를 0으로 설정하여 깔끔한 날짜/시간 저장
        user.setDeleteAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public boolean checkLoginIdDuplicate(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }

    public boolean checkNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}
