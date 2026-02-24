package com.aniping.anipingapp.admin.dto;

import com.aniping.anipingapp.admin.entity.Report;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReportResponseDto {
    private Integer id;
    private Integer reporterId;
    private Report.TargetType targetType;
    private Integer targetId;
    private Report.Reason reason;
    private String content;
    private Report.Status status;
    private String adminComment; // 추가
    private Integer adminId;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    public static ReportResponseDto from(Report report) {
        return ReportResponseDto.builder()
                .id(report.getId())
                .reporterId(report.getReporterId())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reason(report.getReason())
                .content(report.getContent())
                .status(report.getStatus())
                .adminComment(report.getAdminComment()) // 추가
                .adminId(report.getAdminId())
                .createAt(report.getCreateAt())
                .updateAt(report.getUpdateAt())
                .build();
    }
}
