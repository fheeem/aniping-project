package com.aniping.anipingapp.user.repository;

import com.aniping.anipingapp.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByLoginId(String loginId);
    Optional<UserEntity> findByNickname(String nickname);
}
