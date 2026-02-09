package com.aniping.anipingapp.admin.adFaq.controller;

import com.aniping.anipingapp.admin.adFaq.entity.adFaq;
import com.aniping.anipingapp.admin.adFaq.service.AdFaqService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/AdFAQ")
@RequiredArgsConstructor
public class AdFaqController {

    private final AdFaqService adFaqService;

    @GetMapping("/")
    public ResponseEntity<List<adFaq>> list() {
        List<adFaq> faqs = adFaqService.getAllFaq();
        return ResponseEntity.ok(faqs);
    }

    //만들기
    @PostMapping("/Create")
    public ResponseEntity<String> create(@RequestBody FaqRequest dto) {
        adFaqService.createFaq(dto.getQuestion(), dto.getAnswer(), dto.getState());
        return ResponseEntity.ok("생성되었습니다.");
    }

    //수정
    @PutMapping("/Edit/{faqId}")
    public ResponseEntity<String> update(@PathVariable("faqId") int faqId, @RequestBody FaqRequest dto) {
        adFaqService.updateFaq(faqId, dto.getQuestion(), dto.getAnswer(), dto.getState());
        return ResponseEntity.ok("수정되었습니다.");
    }

    //온오프
    @PatchMapping("/State/{faqId}")
    public ResponseEntity<String> changeState(@PathVariable("faqId") int faqId, @RequestParam("state") String state) {
        adFaqService.changeFaqState(faqId, state);
        return ResponseEntity.ok("변경되었습니다.");
    }

    //삭제
    @DeleteMapping("/Delete/{faqId}")
    public ResponseEntity<String> delete(@PathVariable("faqId") int faqId) {
        adFaqService.deleteFaq(faqId);
        return ResponseEntity.ok("삭제되었습니다.");
    }


    @Getter
    @Setter
    public static class FaqRequest {
        private String question;
        private String answer;
        private String state;
    }
}

