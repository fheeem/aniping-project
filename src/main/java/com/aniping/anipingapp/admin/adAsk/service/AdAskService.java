package com.aniping.anipingapp.admin.adAsk.service;

import com.aniping.anipingapp.admin.adAsk.dto.AdAskDto;
import com.aniping.anipingapp.admin.adAsk.entity.AdAskEntity;
import com.aniping.anipingapp.admin.adAsk.repository.AdAskRepository;
import com.aniping.anipingapp.admin.adUser.repository.AdUserRepository;
import com.aniping.anipingapp.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdAskService {
    private final AdAskRepository adAskRepository;
    private final AdUserRepository adUserRepository;

    @Transactional(readOnly = true)
    public List<AdAskDto> getAllAsks() {
        return adAskRepository.findAll().stream()
                .map(AdAskDto::new)
                .toList();
    }

    @Transactional
    public void updateAsk(int id, String ansTitle, String ansContent, Integer adminId){
        AdAskEntity ask = adAskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("작성할 문의가 존재하지 않습니다. ID: " + id));
        UserEntity admin = adUserRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자입니다. ID: " + adminId));

        ask.updateAnswer(ansTitle, ansContent, admin);
    }
}
