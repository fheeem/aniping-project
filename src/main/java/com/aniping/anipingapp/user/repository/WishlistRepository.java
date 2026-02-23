package com.aniping.anipingapp.user.repository;

import com.aniping.anipingapp.user.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    
    // userId로 deleteAt이 null인 찜 목록 조회 (기존 메서드 유지 또는 페이징용으로 대체)
    List<Wishlist> findByUserIdAndDeleteAtIsNull(Long userId);

    // 페이징 및 검색 (제목)
    @Query("SELECT w FROM Wishlist w WHERE w.user.id = :userId AND w.deleteAt IS NULL AND (:keyword IS NULL OR w.animation.title LIKE %:keyword%)")
    Page<Wishlist> findByUserIdAndKeyword(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);

    // 찜 해제용 조회 (userId, aniId, deleteAt is null)
    Optional<Wishlist> findByUserIdAndAnimationIdAndDeleteAtIsNull(Long userId, Integer aniId);
}
