package com.aniping.anipingapp.admin.adUser.repository;

import com.aniping.anipingapp.admin.adUser.entity.AdUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdUserRepository extends JpaRepository<AdUser, Integer> {
    List<AdUser> findByGrade(AdUser.Grade grade);
}
