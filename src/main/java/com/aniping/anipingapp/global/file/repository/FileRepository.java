package com.aniping.anipingapp.global.file.repository;

import com.aniping.anipingapp.global.constant.TargetType;
import com.aniping.anipingapp.global.file.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Integer> {
    // status가 ACTIVE인 파일만 조회
    List<File> findByTargetTypeAndTargetIdAndStatus(TargetType targetType, Integer targetId, File.FileStatus status);
}
