package com.aniping.anipingapp.admin.adAsk.dto;

import com.aniping.anipingapp.admin.adAsk.entity.AdAskEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdAskDto {
    private int id;

    private String title;

    private String userName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDateTime createAt;

    private boolean status;

    private String content;

    private String ansTitle;

    private String ansContent;

    public AdAskDto(AdAskEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.status = entity.isStatus();
        this.createAt = entity.getCreateAt();
        this.ansTitle = entity.getAnsTitle();
        this.ansContent = entity.getAnsContent();

        this.userName = (entity.getUser() != null) ? entity.getUser().getName() : "탈퇴한 사용자";
    }
}
