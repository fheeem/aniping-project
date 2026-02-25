package com.aniping.anipingapp.character.entity;

import com.aniping.anipingapp.character.constant.LineStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "famousline") // 테이블명 일치
public class FamousLineEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer charId; // 테이블의 charId와 매칭

    @Column(length = 500, nullable = false)
    private String content;

//    @Column(columnDefinition = "TEXT")
//    private String sceneImg;

    private Integer likes = 0; // voteCount 대신 likes 사용

    @Enumerated(EnumType.STRING)
    private LineStatus active; // status 대신 active 사용 (waiting, accept, reject)

    private Integer userId;

    @Column(updatable = false)
    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private LocalDateTime deleteAt;

    // 데이터 저장 전 시간 자동 세팅
    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        this.active = (this.active == null) ? LineStatus.waiting : this.active;
    }

    // 데이터 수정 시 시간 자동 갱신
    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}