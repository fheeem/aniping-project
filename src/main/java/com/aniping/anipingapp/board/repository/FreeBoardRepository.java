package com.aniping.anipingapp.board.repository;

import com.aniping.anipingapp.board.entity.FreeBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FreeBoardRepository extends JpaRepository<FreeBoard, Integer> {
    
    @Query("SELECT f FROM FreeBoard f WHERE f.user.id = :userId AND f.deleteAt IS NULL AND (:keyword IS NULL OR f.title LIKE %:keyword%)")
    Page<FreeBoard> findByUserIdAndKeyword(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);

    // 일반 게시글 검색 (공지 제외)
    @Query("SELECT f FROM FreeBoard f WHERE f.deleteAt IS NULL AND f.boardType = 'FREEBOARD' AND (:keyword IS NULL OR f.title LIKE %:keyword%)")
    Page<FreeBoard> findAllFreeBoardByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 공지사항 조회
    @Query("SELECT f FROM FreeBoard f WHERE f.deleteAt IS NULL AND f.boardType = 'NOTIFICATION' ORDER BY f.createAt DESC")
    List<FreeBoard> findNotifications();
}
