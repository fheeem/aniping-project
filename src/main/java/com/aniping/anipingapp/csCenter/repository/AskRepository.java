package com.aniping.anipingapp.csCenter.repository;

import com.aniping.anipingapp.csCenter.entity.Ask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AskRepository extends JpaRepository<Ask, Integer> {

    @Query("SELECT a FROM Ask a WHERE a.user.id = :userId AND a.deleteAt IS NULL " +
           "AND (:status IS NULL OR a.status = :status) " +
           "AND (:keyword IS NULL OR a.title LIKE %:keyword% OR a.content LIKE %:keyword%)")
    Page<Ask> findByUserIdAndStatusAndKeyword(@Param("userId") Long userId, 
                                              @Param("status") Boolean status, 
                                              @Param("keyword") String keyword, 
                                              Pageable pageable);

    Optional<Ask> findByIdAndUserIdAndDeleteAtIsNull(Integer id, Long userId);
}
