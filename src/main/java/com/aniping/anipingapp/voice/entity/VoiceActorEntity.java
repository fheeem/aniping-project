package com.aniping.anipingapp.voice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "voiceactor")
public class VoiceActorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

//    @Column(columnDefinition = "TEXT")
//    private String image;

    private String birth;
    private Integer height;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private String agency;

    @Column(name = "`rank`")
    private Integer rank;

    private Integer likes = 0;

    @Transient
    private List<String> aniImages = new ArrayList<>();

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private LocalDateTime deleteAt;

    @PrePersist
    protected void onCreate() {
        this.createAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }

    @JsonProperty("bloodTypeDisplayName")
    public String getBloodTypeDisplayName() {
        if (this.bloodType == null) return "Unknown";
        return this.bloodType.getDisplayName();
    }

    public enum BloodType {
        A, B, AB, O, N;

        public String getDisplayName() {
            return this == N ? "Unknown" : this.name();
        }
    }
}