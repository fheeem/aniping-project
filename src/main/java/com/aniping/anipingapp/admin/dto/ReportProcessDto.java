package com.aniping.anipingapp.admin.dto;

import com.aniping.anipingapp.admin.entity.Report;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportProcessDto {
    private Report.Status status;
    private String adminComment; // adminMemo -> adminComment 변경
}
