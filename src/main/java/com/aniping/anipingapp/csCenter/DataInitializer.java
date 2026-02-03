package com.aniping.anipingapp.csCenter;

import com.aniping.anipingapp.csCenter.entity.Faq;
import com.aniping.anipingapp.csCenter.repository.FaqRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final FaqRepository faqRepository;

    public DataInitializer(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @Override
    public void run(String... args) {
        Faq q1 = new Faq();
        q1.setTitle("임시: 로그인 오류 해결 방법");
        q1.setAnswer("쿠키를 삭제하고 다시 시도해보세요.");
        faqRepository.save(q1);

        System.out.println("임시 데이터가 주입되었습니다!");
    }
}
