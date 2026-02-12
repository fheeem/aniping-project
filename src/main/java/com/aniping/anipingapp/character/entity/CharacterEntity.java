package com.aniping.anipingapp.character.entity;

import com.aniping.anipingapp.character.constant.ActiveStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "characters")
public class CharacterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "aniId")
    private Integer aniId;

    @Column(name = "cvId")
    private Integer cvId;

    private String name;
    private String image;

    @Column(name = "voteCount")
    private Integer voteCount;

    @Enumerated(EnumType.STRING)
    private ActiveStatus active;

    @Column(name = "userId")
    private Integer userId;

    @Column(name = "createAt", updatable = false)
    private LocalDateTime createAt;

    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    @Column(name = "deleteAt")
    private LocalDateTime deleteAt;

    @Transient
    private boolean liked;
}