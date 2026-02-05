package com.aniping.anipingapp.admin.adUser.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdUserDto {
    private int id;
    private String nickname;
    private String name;
    private String email;
    private String grade;
    private LocalDateTime createdAt;
}
