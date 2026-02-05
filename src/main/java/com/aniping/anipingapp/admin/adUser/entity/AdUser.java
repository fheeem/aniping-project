package com.aniping.anipingapp.admin.adUser.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(name = "nickname", unique = true, nullable = false, length = 50)
    private String nickname;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('USER', 'ADMIN') DEFAULT 'USER'")
    private  Grade grade;

    @Column(name = "createAt", updatable = false)
    private LocalDateTime createdAt;

    public void setGrade(Grade grade) {
        this.grade = grade;
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
