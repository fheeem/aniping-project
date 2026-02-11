package com.aniping.anipingapp.admin.adUser.service;

import com.aniping.anipingapp.admin.adUser.dto.AdUserDto;
import com.aniping.anipingapp.admin.adUser.repository.AdUserRepository;
import com.aniping.anipingapp.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdUserService {
    private final AdUserRepository adUserRepository;

    public List<AdUserDto> findAllUsers() {

        List<UserEntity> users = adUserRepository.findAll();


        return users.stream()
                .map(user -> new AdUserDto(
                        user.getId(),
                        user.getNickname(),
                        user.getName(),
                        user.getEmail(),
                        user.getGrade().name(),
                        user.getCreateAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteById(int id) {
        if (!adUserRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 사용자가 존재하지 않습니다. id=" + id);
        }
        adUserRepository.deleteById(id);
    }

    @Transactional
    public void updateUserGrade(int id, String newGrade) {
        UserEntity user = adUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다. id=" + id));

        user.setGrade(UserEntity.Grade.valueOf(newGrade.toUpperCase()));
    }
}
