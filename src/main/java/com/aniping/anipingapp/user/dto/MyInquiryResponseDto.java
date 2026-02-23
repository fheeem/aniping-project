package com.aniping.anipingapp.user.dto;

import com.aniping.anipingapp.csCenter.entity.Ask;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MyInquiryResponseDto {
    private Integer id;
    private String title;
    private String content;
    private Boolean status; // false: 답변대기, true: 답변완료
    private String ansTitle;
    private String ansContent;
    private LocalDateTime replyAt;
    private LocalDateTime createAt;

    public static MyInquiryResponseDto from(Ask ask) {
        return MyInquiryResponseDto.builder()
                .id(ask.getId())
                .title(ask.getTitle())
                .content(ask.getContent())
                .status(ask.getStatus())
                .ansTitle(ask.getAnsTitle())
                .ansContent(ask.getAnsContent())
                .replyAt(ask.getReplyAt())
                .createAt(ask.getCreateAt())
                .build();
    }
}
