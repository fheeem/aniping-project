package com.aniping.anipingapp.admin.adUser.repository;

import com.aniping.anipingapp.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdUserRepository extends JpaRepository<UserEntity, Integer> {
    List<UserEntity> findByGrade(UserEntity.Grade grade);
}
