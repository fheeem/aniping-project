package com.aniping.anipingapp.admin.repository;

import com.aniping.anipingapp.admin.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    // 상태별 필터링 조회
    Page<Report> findByStatus(Report.Status status, Pageable pageable);
}
