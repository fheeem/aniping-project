package com.aniping.anipingapp.admin.adAsk.repository;

import com.aniping.anipingapp.admin.adAsk.entity.AdAskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdAskRepository extends JpaRepository<AdAskEntity, Integer> {

}
