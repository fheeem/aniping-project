package com.aniping.anipingapp.admin.adFaq.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "faq")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class adFaq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faqId")
    private int faqId;

    @Column(nullable = false, length = 500)
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String state = "ON";

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime regDate;

    public void update(String question, String answer, String state) {
        this.question = question;
        this.answer = answer;
        this.state = state;
    }

    public void toggleState(String state) {
        this.state = state;
    }
}
