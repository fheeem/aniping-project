package com.aniping.anipingapp.admin.adNotice.service;

import com.aniping.anipingapp.admin.adNotice.dto.AdNoticeDto;
import com.aniping.anipingapp.admin.adNotice.entity.AdNoticeEntity;
import com.aniping.anipingapp.admin.adNotice.repository.AdNoticeRepository;
import com.aniping.anipingapp.admin.adUser.repository.AdUserRepository;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdNoticeService {
    private final AdNoticeRepository adNoticeRepository;
    private final AdUserRepository aduserRepository;

    //조회
    public List<AdNoticeDto> getAllNotices() {
        return adNoticeRepository.findAllByBoardTypeAndDeleteAtIsNullOrderByIdDesc(AdNoticeEntity.BoardType.notification)
                .stream()
                .map(AdNoticeDto::fromEntity)
                .toList();
    }

    //삭제
    @Transactional
    public void deleteNotice(Integer id) {
        AdNoticeEntity notice = adNoticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 게시글이 없습니다. id=" + id));
        notice.deletedTime();
        adNoticeRepository.save(notice);
    }

    //추가
    @Transactional
    public AdNoticeDto saveNotice(String title, String content, Integer userId) {
        UserEntity user = aduserRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. id=" + userId));

        AdNoticeEntity notice = AdNoticeEntity.builder()
                .title(title)
                .content(content)
                .user(user)
                .boardType(AdNoticeEntity.BoardType.notification)
                .build();

        AdNoticeEntity saved = adNoticeRepository.save(notice);
        return AdNoticeDto.fromEntity(saved);
    }

    //수정
    @Transactional
    public void updateNotice(Integer id, String title, String content) {
        AdNoticeEntity notice = adNoticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("수정할 게시글이 없습니다. id=" + id));
        notice.updateNotice(title, content);
    }


    //검색
    public List<AdNoticeDto> searchNoticesByTitle(String keyword) {
        return adNoticeRepository.findByTitleContainingAndBoardType(
                        keyword,
                        AdNoticeEntity.BoardType.notification
                )
                .stream()
                .map(AdNoticeDto::fromEntity)
                .toList();
    }



}
