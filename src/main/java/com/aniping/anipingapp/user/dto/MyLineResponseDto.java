package com.aniping.anipingapp.user.dto;

import com.aniping.anipingapp.user.entity.FamousLine;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MyLineResponseDto {
    private Integer id;
    private String content;
    private Integer likes;
    private LocalDateTime createAt;
    private String imgUrl;

    public static MyLineResponseDto from(FamousLine famousLine, String imgUrl) {
        return MyLineResponseDto.builder()
                .id(famousLine.getId())
                .content(famousLine.getContent())
                .likes(famousLine.getLikes())
                .createAt(famousLine.getCreateAt())
                .imgUrl(imgUrl)
                .build();
    }
}
