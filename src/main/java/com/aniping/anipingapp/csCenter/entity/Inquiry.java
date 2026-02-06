package com.aniping.anipingapp.csCenter.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "ask")
@Getter @Setter
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private String content;

    @Column(name = "userId")
    private Integer userId;

    @Column(name = "createAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "ansTitle")
    private String ansTitle;

    @Column(name = "ansContent")
    private String ansContent;

    @Column(name = "adminId")
    private Integer adminId;

    @Column(name = "replyAt")
    private LocalDateTime replyAt;

    private Boolean status = false;
}