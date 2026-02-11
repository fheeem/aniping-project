package com.aniping.anipingapp.admin.adUser.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdUser {

    public enum Grade {
        USER, ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="loginId", unique = true, nullable = false, length = 50)
    private String loginId;

    @Column(name="password", nullable = false, length = 255)
    private String password;

    @Column(name = "nickname", unique = true, nullable = false, length = 50)
    private String nickname;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "phoneNumber", unique = true, nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "age")
    private Integer age;

    @Column(columnDefinition = "TEXT")
    private String profileImg;

    @Column(name = "best_ani")
    private Integer best_ani;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('USER', 'ADMIN') DEFAULT 'USER'")
    private  Grade grade;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('LOCAL', 'GOOGLE', 'KAKAO') DEFAULT 'LOCAL'")
    private SocialType social;

    @Column(name = "createAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

    private LocalDateTime deleteAt;

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public enum SocialType {
        LOCAL, GOOGLE, KAKAO
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public AdUser(String nickname, String name, String email, Grade grade) {
        this.nickname = nickname;
        this.name = name;
        this.email = email;
        this.grade = (grade == null) ? Grade.USER : grade;
    }
}
