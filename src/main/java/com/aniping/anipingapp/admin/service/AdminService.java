package com.aniping.anipingapp.admin.service;

import com.aniping.anipingapp.admin.dto.ReportProcessDto;
import com.aniping.anipingapp.admin.dto.ReportResponseDto;
import com.aniping.anipingapp.admin.entity.Report;
import com.aniping.anipingapp.admin.repository.ReportRepository;
import com.aniping.anipingapp.board.entity.Comment;
import com.aniping.anipingapp.board.entity.FreeBoard;
import com.aniping.anipingapp.board.repository.CommentRepository;
import com.aniping.anipingapp.board.repository.FreeBoardRepository;
import com.aniping.anipingapp.character.entity.CharacterEntity;
import com.aniping.anipingapp.character.entity.FamousLineEntity;
import com.aniping.anipingapp.character.repository.CharacterRepository;
import com.aniping.anipingapp.user.repository.MyFamousLineRepository;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ReportRepository reportRepository;
    private final FreeBoardRepository freeBoardRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final MyFamousLineRepository famousLineRepository;
    private final CharacterRepository characterRepository;

    @Transactional(readOnly = true)
    public Page<ReportResponseDto> getReports(Report.Status status, Pageable pageable) {
        if (status == null) {
            return reportRepository.findAll(pageable).map(ReportResponseDto::from);
        }
        return reportRepository.findByStatus(status, pageable).map(ReportResponseDto::from);
    }

    @Transactional
    public void processReport(Integer reportId, ReportProcessDto processDto, Long adminId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));

        report.setStatus(processDto.getStatus());
        report.setAdminId(adminId.intValue());
        report.setAdminComment(processDto.getAdminComment()); // 관리자 코멘트 저장

        // 처리 완료(PROCESSED) 시 대상 콘텐츠 삭제 (Soft Delete)
        if (processDto.getStatus() == Report.Status.PROCESSED) {
            deleteTargetContent(report.getTargetType(), report.getTargetId());
        }
        reportRepository.save(report); // 변경된 report 저장
    }

    private void deleteTargetContent(Report.TargetType targetType, Integer targetId) {
        switch (targetType) {
            case BOARD:
                FreeBoard board = freeBoardRepository.findById(targetId).orElse(null);
                if (board != null) {
                    board.setDeleteAt(LocalDateTime.now());
                    freeBoardRepository.save(board);
                }
                break;
            case COMMENT:
                Comment comment = commentRepository.findById(targetId).orElse(null);
                if (comment != null) {
                    comment.setDeleteAt(LocalDateTime.now());
                    commentRepository.save(comment);
                }
                break;
            case USER:
                UserEntity user = userRepository.findById(targetId.longValue()).orElse(null);
                if (user != null) {
                    user.setDeleteAt(LocalDateTime.now());
                    userRepository.save(user);
                }
                break;
            case LINE:
                FamousLineEntity line = famousLineRepository.findById(targetId).orElse(null);
                if (line != null) {
                    line.setDeleteAt(LocalDateTime.now());
                    famousLineRepository.save(line);
                }
                break;
            case CHARACTER:
                CharacterEntity character = characterRepository.findById(targetId).orElse(null);
                if (character != null) {
                    character.setDeleteAt(LocalDateTime.now());
                    characterRepository.save(character);
                }
                break;
        }
    }
}
