package com.aniping.anipingapp.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "famousline")
@Getter
@Setter
public class FamousLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer charId; // 캐릭터 ID (연관관계 매핑은 필요 시 추가)

    @Column(length = 500)
    private String content;

    private Integer likes = 0;

    @Enumerated(EnumType.STRING)
    private ActiveStatus active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;

    @CreationTimestamp
    @Column(name = "createAt", updatable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    @Column(name = "deleteAt")
    private LocalDateTime deleteAt;

    public enum ActiveStatus {
        waiting, accept, reject
    }
}
