package com.aniping.anipingapp.admin.adFaq.repository;

import com.aniping.anipingapp.admin.adFaq.entity.adFaq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdFaqRepository extends JpaRepository<adFaq, Integer> {
    List<adFaq> findByState(String state);
}
