package com.aniping.anipingapp.csCenter.controller;

import com.aniping.anipingapp.csCenter.entity.Inquiry;
import com.aniping.anipingapp.csCenter.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cs")
@RequiredArgsConstructor
public class InquiryController {
    private final InquiryRepository inquiryRepository;

    @PostMapping("/inquiry")
    public Inquiry createInquiry(@RequestBody Inquiry inquiry) {
        return inquiryRepository.save(inquiry);
    }

    @GetMapping("/inquiries")
    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();

    }
}
