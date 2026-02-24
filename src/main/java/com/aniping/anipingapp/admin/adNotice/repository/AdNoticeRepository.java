package com.aniping.anipingapp.admin.adNotice.repository;

import com.aniping.anipingapp.admin.adNotice.entity.AdNoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdNoticeRepository extends JpaRepository<AdNoticeEntity, Integer> {

    List<AdNoticeEntity> findByTitleContainingAndBoardType(
            String keyword,
            AdNoticeEntity.BoardType boardType
    );

    List<AdNoticeEntity> findAllByBoardType(AdNoticeEntity.BoardType boardType);

    List<AdNoticeEntity> findAllByBoardTypeAndDeleteAtIsNullOrderByIdDesc(AdNoticeEntity.BoardType boardType);

}
