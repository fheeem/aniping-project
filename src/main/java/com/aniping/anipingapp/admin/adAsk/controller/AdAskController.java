package com.aniping.anipingapp.admin.adAsk.controller;

import com.aniping.anipingapp.admin.adAsk.dto.AdAskDto;
import com.aniping.anipingapp.admin.adAsk.service.AdAskService;
import com.aniping.anipingapp.admin.adUser.entity.AdUser;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/AdCuSeAsk")
@RequiredArgsConstructor
public class AdAskController {

    private final AdAskService adAskService;

    @GetMapping
    public ResponseEntity<List<AdAskDto>> list(){
        List<AdAskDto> asks = adAskService.getAllAsks();
        return ResponseEntity.ok(asks);
    }

    @PutMapping("/Edit/{id}")
    public ResponseEntity<String> update(@PathVariable("id") int id, @RequestBody AskRequest dto){
        adAskService.updateAsk(
                id, dto.getAnsTitle(), dto.getAnsContent(), dto.getAdminId());
        return ResponseEntity.ok("저장되었습니다.");
    }

    @Getter
    @Setter
    public static class AskRequest{
        private String ansTitle;
        private String ansContent;
        private Integer adminId;
    }
}
