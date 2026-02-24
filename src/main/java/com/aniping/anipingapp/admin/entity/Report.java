package com.aniping.anipingapp.admin.entity;

import com.aniping.anipingapp.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer reporterId;

    @Enumerated(EnumType.STRING)
    private TargetType targetType;

    private Integer targetId;

    @Enumerated(EnumType.STRING)
    private Reason reason;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private Status status = Status.WAITING;

    @Column(columnDefinition = "TEXT")
    private String adminComment; // 관리자 코멘트 추가

    private Integer adminId;

    @CreationTimestamp
    @Column(name = "createAt", updatable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    public enum TargetType {
        BOARD, COMMENT, USER, LINE, CHARACTER
    }

    public enum Reason {
        SPAM, INSULT, ADULT, SPOILER, ETC
    }

    public enum Status {
        WAITING, PROCESSED, REJECTED
    }
}
