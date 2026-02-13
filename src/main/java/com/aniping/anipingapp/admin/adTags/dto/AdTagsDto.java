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
    private String name;

    @Pattern(regexp = "^[가-힣]+$", message = "태그 이름은 완성된 한글만 가능합니다.")
    private String nameKo;

    @Pattern(regexp = "^[a-zA-Z]*$", message = "영어만 입력 가능합니다.")
    private String nameEn;

    public AdTagsDto(AdTagsEntity adTagsEntity) {
        this.id = adTagsEntity.getId();
        this.name = adTagsEntity.getName();
        String[] parts = adTagsEntity.getName().split("\\s*:\\s*");

        if (parts.length == 2) {
            this.nameKo = parts[0];
            this.nameEn = parts[1];
        } else {
            this.nameKo = adTagsEntity.getName();
            this.nameEn = "";
        }
    }
}
