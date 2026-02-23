package com.aniping.anipingapp.csCenter.entity;

import com.aniping.anipingapp.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ask")
@Getter
@Setter
public class Ask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;

    @Column(columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean status; // false: 답변대기, true: 답변완료

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 100)
    private String ansTitle;

    @Column(columnDefinition = "TEXT")
    private String ansContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adminId")
    private UserEntity admin;

    private LocalDateTime replyAt;

    @CreationTimestamp
    @Column(name = "createAt", updatable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    @Column(name = "deleteAt")
    private LocalDateTime deleteAt;
}
