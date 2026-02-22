package com.aniping.anipingapp.animation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "anilist")
@Getter
@Setter
public class Anilist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private String director;
    private String studio;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDate date;
    private String grade;
    
    @Column(columnDefinition = "TEXT")
    private String aniPv;
    
    private String viewCount;
    private String likes;
    private Integer cateId;

    @Column(name = "createAt", updatable = false)
    private LocalDateTime createAt;

    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    @Column(name = "deleteAt")
    private LocalDateTime deleteAt;
}
