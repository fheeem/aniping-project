package com.aniping.anipingapp.voice.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.aniping.anipingapp.voice.entity.VoiceActorEntity;
import com.aniping.anipingapp.voice.repository.VoiceActorRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.net.ssl.*;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class S3MigrationService {

    private final AmazonS3 amazonS3;
    private final VoiceActorRepository repository;
    private final ObjectMapper objectMapper;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    // SSL 보안 검증을 무시하는 설정 (PKIX 에러 해결)
    private void disableSslVerification() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() { return null; }
                public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                public void checkServerTrusted(X509Certificate[] certs, String authType) {}
            }};

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            HostnameVerifier allHostsValid = (hostname, session) -> true;
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void migrateFromJson() {
        // 1. SSL 검증 무시 실행
        disableSslVerification();

        try {
            ClassPathResource resource = new ClassPathResource("onnadaCvList.json");
            List<Map<String, Object>> dataList = objectMapper.readValue(
                    resource.getInputStream(),
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            if (dataList == null || dataList.isEmpty()) return;

            for (Map<String, Object> data : dataList) {
                String name = (String) data.get("name");
                Map<String, Object> imageGroup = (Map<String, Object>) data.get("image");
                String externalUrl = (imageGroup != null) ? (String) imageGroup.get("thumb") : "";

                if (externalUrl == null || externalUrl.isEmpty()) continue;

                try {
                    String s3Url = uploadToS3(externalUrl, name);
                    System.out.println(">>> [성공] " + name + " -> " + s3Url);

                    VoiceActorEntity entity = new VoiceActorEntity();
                    entity.setName(name);
                    entity.setImage(s3Url);
                    repository.save(entity);

                    Thread.sleep(200);
                } catch (Exception e) {
                    System.err.println(">>> [실패] " + name + " : " + e.getMessage());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String uploadToS3(String externalUrl, String name) throws Exception {
        URL url = new URL(externalUrl);
        // User-Agent 설정 (서버 차단 방지)
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("User-Agent", "Mozilla/5.0");

        InputStream is = connection.getInputStream();

        String safeName = name.replaceAll("\\s+", "_").replaceAll("[^a-zA-Z0-9가-힣_]", "");
        String s3Key = "aniping/voiceactor/" + safeName + "_" + System.currentTimeMillis() + ".jpg";

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/jpeg");

        amazonS3.putObject(new PutObjectRequest(bucket, s3Key, is, metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        return amazonS3.getUrl(bucket, s3Key).toString();
    }
}