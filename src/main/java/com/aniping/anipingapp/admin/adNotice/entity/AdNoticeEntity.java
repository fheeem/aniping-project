package com.aniping.anipingapp.admin.adNotice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.aniping.anipingapp.user.entity.UserEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "freeboard")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdNoticeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder.Default
    private int views = 0;

    @Builder.Default
    private int likes = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

    private LocalDateTime deleteAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BoardType boardType = BoardType.notification;

    public void updateNotice(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void deletedTime() {
        this.deleteAt = LocalDateTime.now();
    }

    public enum BoardType {
        notification,
        freeboard
    }

    @Builder
    public AdNoticeEntity(String title, String content, UserEntity user, BoardType boardType) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.boardType = boardType != null ? boardType : BoardType.notification;
    }
}
