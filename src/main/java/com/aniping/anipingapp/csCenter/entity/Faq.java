package com.aniping.anipingapp.csCenter.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "faq")
@Getter @Setter
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faqId")
    private Integer faqId;

    @Column(name = "question")
    private String question;

    @Column(name = "answer")
    private String answer;

    @Column(name = "state")
    private String state = "ON";

    @Column(name = "regDate")
    private LocalDateTime regDate = LocalDateTime.now();
}