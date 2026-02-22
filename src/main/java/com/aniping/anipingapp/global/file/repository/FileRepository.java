package com.aniping.anipingapp.global.file.repository;

import com.aniping.anipingapp.global.constant.TargetType;
import com.aniping.anipingapp.global.file.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Integer> {
    // status가 ACTIVE인 파일만 조회
    List<File> findByTargetTypeAndTargetIdAndStatus(TargetType targetType, Integer targetId, File.FileStatus status);
    
    // 썸네일용 단일 파일 조회 (ACTIVE 상태)
    Optional<File> findFirstByTargetTypeAndTargetIdAndStatus(TargetType targetType, Integer targetId, File.FileStatus status);
}
