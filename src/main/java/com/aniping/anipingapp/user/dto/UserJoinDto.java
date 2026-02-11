package com.aniping.anipingapp.user.dto;

import com.aniping.anipingapp.user.entity.UserEntity;
import lombok.Data;

@Data
public class UserJoinDto {
    private String loginId;
    private String password;
    private String nickname;
    private String name;
    private String email;
    private String phoneNumber;
    private Integer age;
    private String favoriteAni;

    public UserEntity toEntity(String encodedPassword) {
        UserEntity userEntity = new UserEntity();
        userEntity.setLoginId(this.loginId);
        userEntity.setPassword(encodedPassword);
        userEntity.setNickname(this.nickname);
        userEntity.setName(this.name != null ? this.name : this.nickname);
        userEntity.setEmail(this.email);
        userEntity.setPhoneNumber(this.phoneNumber);
        userEntity.setAge(this.age);
        userEntity.setBestAni(this.favoriteAni); // favoriteAni -> bestAni 매핑
        userEntity.setGrade(UserEntity.Grade.USER);
        userEntity.setSocial(UserEntity.Social.LOCAL);
        return userEntity;
    }
}
