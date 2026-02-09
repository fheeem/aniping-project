package com.aniping.anipingapp.admin.adFaq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class adFaqDto {
    private int faqId;
    private String question;
    private String answer;
    private String state;
    private LocalDateTime regDate;
}
