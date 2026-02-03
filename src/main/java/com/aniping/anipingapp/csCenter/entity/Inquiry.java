package com.aniping.anipingapp.csCenter.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Inquiry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;   // 문의 제목

    @Column(columnDefinition = "TEXT")
    private String content; // 문의 내용

    private LocalDateTime createdAt = LocalDateTime.now();
}
