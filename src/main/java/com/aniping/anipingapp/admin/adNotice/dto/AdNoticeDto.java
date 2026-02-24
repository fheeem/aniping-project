package com.aniping.anipingapp.admin.adNotice.dto;

import com.aniping.anipingapp.admin.adNotice.entity.AdNoticeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdNoticeDto {
    private Integer id;
    private Integer userId;
    private String title;
    private String content;
    private LocalDateTime date;

    public static AdNoticeDto fromEntity(AdNoticeEntity entity) {
        return AdNoticeDto.builder()
                .id(entity.getId())
                .userId(entity.getUser() != null ? entity.getUser().getId().intValue() : null)
                .title(entity.getTitle())
                .content(entity.getContent())
                .date(entity.getCreateAt())
                .build();
    }
}
