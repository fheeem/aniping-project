package com.aniping.anipingapp.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "loginId", unique = true, nullable = false, length = 50)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 50)
    private String nickname;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "phoneNumber", unique = true, length = 20)
    private String phoneNumber;

    private Integer age;

    @Lob
    @Column(name = "profileImg")
    private String profileImg;

    @Column(name = "best_ani")
    private String bestAni; // Integer -> String 변경 (사용자 입력 텍스트 저장)

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('USER', 'ADMIN') DEFAULT 'USER'")
    private Grade grade;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('LOCAL', 'GOOGLE', 'KAKAO') DEFAULT 'LOCAL'")
    private Social social;

    @Column(name = "createAt", updatable = false)
    private LocalDateTime createAt;

    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    @Column(name = "deleteAt")
    private LocalDateTime deleteAt;

    @PrePersist
    protected void onCreate() {
        createAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = LocalDateTime.now();
    }

    public enum Grade {
        USER, ADMIN
    }

    public enum Social {
        LOCAL, GOOGLE, KAKAO
    }
}
