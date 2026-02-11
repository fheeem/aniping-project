package com.aniping.anipingapp.admin.adUser.controller;

import com.aniping.anipingapp.admin.adUser.dto.AdUserDto;
import com.aniping.anipingapp.admin.adUser.service.AdUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AdUserController {

    private final AdUserService adUserService;

    @GetMapping({"/AdUserLi", "/AdminSetting"})
    public ResponseEntity<List<AdUserDto>> list() {

        List<AdUserDto> result = adUserService.findAllUsers();

        if(result != null){
            return ResponseEntity.ok().body(result);
        } else {
            return (ResponseEntity<List<AdUserDto>>) ResponseEntity.badRequest();
        }

    }

    @DeleteMapping("/AdUserLi/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        try {
            adUserService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping({"/AdUserLi/{id}", "/AdminSetting/{id}"})
    public ResponseEntity<Void> updateGrade(@PathVariable int id, @RequestBody Map<String, String> body) {
        try {
            String newGrade = body.get("grade");
            adUserService.updateUserGrade(id, newGrade);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



}
