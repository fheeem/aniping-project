package com.aniping.anipingapp.admin.adFaq.service;

import com.aniping.anipingapp.admin.adFaq.entity.adFaq;
import com.aniping.anipingapp.admin.adFaq.repository.AdFaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdFaqService {
    private final AdFaqRepository adFaqRepository;

    public List<adFaq> getAllFaq() {
        return adFaqRepository.findAll();
    }

    //작성
    @Transactional
    public void createFaq(String question, String answer) {
        adFaq newFaq = adFaq.builder()
                .question(question)
                .answer(answer)
                .build();

        adFaqRepository.save(newFaq);
    }

    //수정
    @Transactional
    public void updateFaq(int faqId, String question, String answer) {
        adFaq faq = adFaqRepository.findById(faqId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 FAQ가 존재하지 않습니다. ID: " + faqId));

        faq.update(question, answer);
    }

    //제거
    @Transactional
    public void deleteFaq(int faqId) {
        if (!adFaqRepository.existsById(faqId)) {
            throw new IllegalArgumentException("오류가 발생했습니다.");
        }

        adFaqRepository.deleteById(faqId);
    }

}
