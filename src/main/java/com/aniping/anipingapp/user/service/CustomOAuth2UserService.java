package com.aniping.anipingapp.user.service;

import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // google
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        // 구글은 email, name 등을 attributes에서 바로 꺼낼 수 있음
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // DB에서 이메일로 사용자 조회
        Optional<UserEntity> userOptional = userRepository.findByLoginId(email);

        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            // 이미 가입된 사용자라면 업데이트 등 처리 (필요 시)
            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getGrade().name())),
                    attributes,
                    userNameAttributeName
            );
        } else {
            // 신규 사용자라면 attributes를 그대로 반환하여 SuccessHandler에서 처리하도록 함
            // ROLE_GUEST 권한 부여
            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_GUEST")),
                    attributes,
                    userNameAttributeName
            );
        }
    }
}
