package com.aniping.anipingapp.user.dto;

import com.aniping.anipingapp.board.entity.FreeBoard;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MyPostResponseDto {
    private Integer id;
    private String title;
    private Integer views;
    private Integer likes;
    private LocalDateTime createAt;

    public static MyPostResponseDto from(FreeBoard freeBoard) {
        return MyPostResponseDto.builder()
                .id(freeBoard.getId())
                .title(freeBoard.getTitle())
                .views(freeBoard.getViews())
                .likes(freeBoard.getLikes())
                .createAt(freeBoard.getCreateAt())
                .build();
    }
}
