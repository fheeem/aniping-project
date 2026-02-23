package com.aniping.anipingapp.user.repository;


import com.aniping.anipingapp.user.entity.FamousLine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MyFamousLineRepository extends JpaRepository<FamousLine, Integer> {

    // userId, deleteAt is null, active is accept 조건으로 조회
    Page<FamousLine> findByUserIdAndDeleteAtIsNullAndActive(Long userId, FamousLine.ActiveStatus active, Pageable pageable);

    // 삭제를 위한 단건 조회 (userId 조건 포함하여 본인 확인)
    Optional<FamousLine> findByIdAndUserIdAndDeleteAtIsNull(Integer id, Long userId);
}