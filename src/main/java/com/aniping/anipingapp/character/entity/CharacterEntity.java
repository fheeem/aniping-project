package com.aniping.anipingapp.character.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

// 1. 상태값을 관리할 Enum 생성
enum ActiveStatus {
    waiting, accept, reject
}

@Entity
@Getter @Setter
@Table(name = "characters")
public class CharacterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer aniId;
    private Integer cvId;
    private String name;
    private String image;
    private Integer voteCount;

    // 2. 타입을 Enum으로 변경
    @Enumerated(EnumType.STRING)
    private ActiveStatus active;

    private Integer userId;

    // 3. 시간 자동 설정을 위한 어노테이션 (선택사항)
    @Column(updatable = false)
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private LocalDateTime deleteAt;

    @Transient
    private boolean liked;
}