package com.aniping.anipingapp.admin.adTags.service;

import com.aniping.anipingapp.admin.adTags.dto.AdTagsDto;
import com.aniping.anipingapp.admin.adTags.entity.AdTagsEntity;
import com.aniping.anipingapp.admin.adTags.repository.AdTagsRepository;
import lombok.RequiredArgsConstructor;
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
    public List<AdTagsDto> findAllTags(){

        List<AdTagsEntity> tags = adTagsRepository.findAll();

        return tags.stream()
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
        String addTagsName = dto.getNameKo() + " : " + dto.getNameEn();
        if (adTagsRepository.existsByName(addTagsName)) {
            throw new IllegalStateException("이미 등록된 태그입니다.");
        }
        AdTagsEntity adTagsEntity = AdTagsEntity.builder()
                .name(addTagsName)
                .build();
        AdTagsEntity savedEntity = adTagsRepository.save(adTagsEntity);
        return new AdTagsDto(savedEntity);
    }
}
