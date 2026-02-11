package com.aniping.anipingapp.admin.adAsk.entity;

import com.aniping.anipingapp.user.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.catalina.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "ask")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdAskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id")
    private int id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;

    @Column(name = "createAt", updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDateTime createAt;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "ansTitle", length = 100)
    private String ansTitle;

    @Column(name = "ansContent")
    private String ansContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adminId")
    private UserEntity admin;

    @Column(name = "replyAt")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDateTime replyAt;

    @Column(name = "status")
    private boolean status;

    public void updateAnswer(String ansTitle, String ansContent, UserEntity admin) {
        this.ansTitle = ansTitle;
        this.ansContent = ansContent;
        this.admin = admin;
        this.replyAt = LocalDateTime.now();
        this.status = true;
    }
}
