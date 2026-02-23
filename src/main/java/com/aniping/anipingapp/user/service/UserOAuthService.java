package com.aniping.anipingapp.user.service;

import com.aniping.anipingapp.user.dto.UserJoinDto;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserOAuthService {

    private final UserRepository userRepository;

    @Transactional
    public UserEntity socialJoin(UserJoinDto userJoinDto, UserEntity.Social social) {
        if (userRepository.existsByLoginId(userJoinDto.getLoginId())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        if (userRepository.existsByNickname(userJoinDto.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setLoginId(userJoinDto.getLoginId());
        // 소셜 로그인은 비밀번호가 없으므로 null 또는 임의의 값 설정 (여기서는 null 허용했으므로 null)
        userEntity.setPassword(null); 
        userEntity.setNickname(userJoinDto.getNickname());
        userEntity.setName(userJoinDto.getName());
        userEntity.setEmail(userJoinDto.getEmail());
        userEntity.setPhoneNumber(userJoinDto.getPhoneNumber());
        userEntity.setAge(userJoinDto.getAge());
        userEntity.setBestAni(userJoinDto.getFavoriteAni());
        userEntity.setGrade(UserEntity.Grade.USER);
        userEntity.setSocial(social);

        return userRepository.save(userEntity);
    }
}
