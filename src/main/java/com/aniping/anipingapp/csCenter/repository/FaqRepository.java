package com.aniping.anipingapp.csCenter.repository;

import com.aniping.anipingapp.csCenter.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
}