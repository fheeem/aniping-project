package com.aniping.anipingapp.global.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TargetType {
    PROFILE(1),
    BANNER(20),
    BOARD(3),
    ASK(3),
    CHARACTER(20),
    LINE(1),
    BTN(20),
    ACTOR(1),
    MAINSLIDE(20),
    ANILIST(1); // 애니메이션 썸네일용

    private final int uploadLimit;
}
