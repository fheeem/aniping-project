package com.aniping.anipingapp.admin.adTags.dto;

import com.aniping.anipingapp.admin.adTags.entity.AdTagsEntity;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdTagsDto {

    private int id;

    @Pattern(regexp = "^[가-힣]+$", message = "태그 이름은 완성된 한글만 가능합니다.")
    private String name;

    @Pattern(regexp = "^[a-zA-Z]*$", message = "영어만 입력 가능합니다.")
    private String slug;

    private int sequence;

    public AdTagsDto(AdTagsEntity adTagsEntity) {
        this.id = adTagsEntity.getId();
        this.name = adTagsEntity.getName();
        this.slug = adTagsEntity.getSlug();
        this.sequence = adTagsEntity.getSequence();
    }
}
