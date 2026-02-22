package com.aniping.anipingapp.user.dto;

import com.aniping.anipingapp.user.entity.Wishlist;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class WishlistResponseDto {
    private Integer id; // Wishlist ID
    private Integer aniId;
    private String title;
    private String studio;
    private String grade;
    private LocalDate date;
    private String imgUrl; // 이미지 URL 추가

    public static WishlistResponseDto from(Wishlist wishlist, String imgUrl) {
        return WishlistResponseDto.builder()
                .id(wishlist.getId())
                .aniId(wishlist.getAnimation().getId())
                .title(wishlist.getAnimation().getTitle())
                .studio(wishlist.getAnimation().getStudio())
                .grade(wishlist.getAnimation().getGrade())
                .date(wishlist.getAnimation().getDate())
                .imgUrl(imgUrl)
                .build();
    }
}
