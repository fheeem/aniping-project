package com.aniping.anipingapp.global.file.entity;

import com.aniping.anipingapp.global.constant.TargetType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "targetType", nullable = false)
    private TargetType targetType;

    @Column(name = "targetId")
    private Integer targetId;

    @Column(name = "s3Key", nullable = false)
    private String s3Key; // S3에 저장된 객체의 URL

    @Column(name = "originalName", nullable = false)
    private String originalName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private FileStatus status = FileStatus.ACTIVE;

    @Column(name = "depth", nullable = false)
    @Builder.Default
    private Integer depth = 0;

    @CreationTimestamp
    @Column(name = "createAt", updatable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updateAt")
    private LocalDateTime updateAt;

    @Column(name = "deleteAt")
    private LocalDateTime deleteAt;

    public enum FileStatus {
        ACTIVE, DELETED
    }
}
