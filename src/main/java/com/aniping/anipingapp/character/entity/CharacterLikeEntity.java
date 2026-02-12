package com.aniping.anipingapp.character.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "character_likes")
public class CharacterLikeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "userId")
    private Long userId;

    @Column(name = "characterId")
    private Integer characterId;
}