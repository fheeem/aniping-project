package com.aniping.anipingapp.admin.adTags.service;

import com.aniping.anipingapp.admin.adTags.dto.AdTagsDto;
import com.aniping.anipingapp.admin.adTags.entity.AdTagsEntity;
import com.aniping.anipingapp.admin.adTags.repository.AdTagsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdTagsService {
    private final AdTagsRepository adTagsRepository;

    //조회
    public List<AdTagsDto> findAllTags() {
        return adTagsRepository.findAll(Sort.by(Sort.Direction.ASC, "sequence"))
                .stream()
                .map(AdTagsDto::new)
                .collect(Collectors.toList());
    }

    //삭제
    @Transactional
    public void deleteById(int id){
        if(!adTagsRepository.existsById(id)){
            throw new IllegalArgumentException("해당 태그가 존재하지 않습니다. id=" + id);
        }
        adTagsRepository.deleteById(id);
    }

    //추가
    @Transactional
    public AdTagsDto addTags(AdTagsDto dto){
        int maxSeq = adTagsRepository.findMaxSequence();
        int nextSequence = maxSeq + 1;

        AdTagsEntity entity = AdTagsEntity.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .sequence(nextSequence)
                .build();

        return new AdTagsDto(adTagsRepository.save(entity));
    }

    //위로 순서변경
    @Transactional
    public void moveUp(int id) {
        AdTagsEntity target = adTagsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("태그를 찾을 수 없습니다."));

        adTagsRepository.findFirstBySequenceLessThanOrderBySequenceDesc(target.getSequence())
                .ifPresent(partner -> swap(target, partner));
    }

    //아래로 순서변경
    @Transactional
    public void moveDown(int id) {
        AdTagsEntity target = adTagsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("태그를 찾을 수 없습니다."));

        adTagsRepository.findFirstBySequenceGreaterThanOrderBySequenceAsc(target.getSequence())
                .ifPresent(partner -> swap(target, partner));
    }

    @Transactional
    private void swap(AdTagsEntity target, AdTagsEntity partner) {
        int targetSeq = target.getSequence();
        int partnerSeq = partner.getSequence();

        target.changeSequence(partnerSeq);
        partner.changeSequence(targetSeq);

        adTagsRepository.flush();
    }
}
