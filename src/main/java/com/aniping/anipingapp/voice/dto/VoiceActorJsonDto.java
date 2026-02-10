package com.aniping.anipingapp.voice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VoiceActorJsonDto {
    private String name;
    private String imageUrl; // JSON 내 이미지 경로 필드명과 일치해야 함
    private List<String> aniImages;
}
