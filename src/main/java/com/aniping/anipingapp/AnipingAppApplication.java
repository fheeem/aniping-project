package com.aniping.anipingapp;

import com.aniping.anipingapp.user.service.AwsCheckService;
import com.aniping.anipingapp.user.service.MyOtherService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;


@SpringBootApplication
//@PropertySource("classpath:secret.properties")
public class AnipingAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnipingAppApplication.class, args);
    }
//    // 서버가 뜨자마자 로그에 버킷 리스트가 찍힙니다.
//    @Bean
//    CommandLineRunner test(AwsCheckService awsCheckService) {
//        return args -> {
//            awsCheckService.checkConnection();
//        };
//    }
//    @Bean
//    CommandLineRunner test2(MyOtherService myOtherService) {
//        return args -> {
//            myOtherService.someMethod();
//        };
//    }
}
