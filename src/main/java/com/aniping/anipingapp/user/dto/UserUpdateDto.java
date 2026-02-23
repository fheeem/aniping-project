package com.aniping.anipingapp.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDto {
    private String nickname;
    private String phone;
    private Integer age; // DB 스키마에 맞춰 Integer로 변경
    private String favoriteAni;
}
