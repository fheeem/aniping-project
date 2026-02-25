package com.aniping.anipingapp.board.dto;

import com.aniping.anipingapp.board.entity.FreeBoard;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChaPostResponseDto {
    private Integer id;
    private String title;
    private String content; // 내용 추가
    private String userName; // 작성자 이름 또는 닉네임
    private Integer views;
    private Integer likes;
    private LocalDateTime createAt;
    private String boardType; // NOTIFICATION or FREEBOARD

    public static ChaPostResponseDto from(FreeBoard freeBoard) {
        return ChaPostResponseDto.builder()
                .id(freeBoard.getId())
                .title(freeBoard.getTitle())
                .content(freeBoard.getContent()) // 내용 매핑
                .userName(freeBoard.getUser() != null ? freeBoard.getUser().getNickname() : "알 수 없음")
                .views(freeBoard.getViews())
                .likes(freeBoard.getLikes())
                .createAt(freeBoard.getCreateAt())
                .boardType(freeBoard.getBoardType().name())
                .build();
    }
}
