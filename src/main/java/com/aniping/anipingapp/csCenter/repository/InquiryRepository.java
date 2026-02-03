package com.aniping.anipingapp.csCenter.repository;

import com.aniping.anipingapp.csCenter.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
}
