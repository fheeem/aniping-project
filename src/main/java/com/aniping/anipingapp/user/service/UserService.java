package com.aniping.anipingapp.user.service;

import com.aniping.anipingapp.board.entity.FreeBoard;
import com.aniping.anipingapp.board.repository.FreeBoardRepository;
import com.aniping.anipingapp.character.entity.FamousLineEntity;
import com.aniping.anipingapp.character.constant.LineStatus;
import com.aniping.anipingapp.csCenter.entity.Ask;
import com.aniping.anipingapp.csCenter.repository.AskRepository;
import com.aniping.anipingapp.global.constant.TargetType;
import com.aniping.anipingapp.global.file.entity.File;
import com.aniping.anipingapp.global.file.repository.FileRepository;
import com.aniping.anipingapp.user.dto.*;
import com.aniping.anipingapp.user.entity.UserEntity;
import com.aniping.anipingapp.user.entity.Wishlist;
import com.aniping.anipingapp.user.repository.MyFamousLineRepository;
import com.aniping.anipingapp.user.repository.UserRepository;
import com.aniping.anipingapp.user.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WishlistRepository wishlistRepository;
    private final FreeBoardRepository freeBoardRepository;
    private final MyFamousLineRepository myFamousLineRepository; // 변경됨
    private final AskRepository askRepository;
    private final FileRepository fileRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserEntity join(UserJoinDto userJoinDto) {
        if (userRepository.existsByLoginId(userJoinDto.getLoginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByNickname(userJoinDto.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userJoinDto.getPassword());
        UserEntity userEntity = userJoinDto.toEntity(encodedPassword);

        return userRepository.save(userEntity);
    }

    public Optional<UserEntity> authenticate(UserLoginDto userLoginDto) {
        UserEntity user = userRepository.findByLoginId(userLoginDto.getLoginId())
                .orElseThrow(() -> new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다."));

        if (user.getSocial() != UserEntity.Social.LOCAL) {
            throw new BadCredentialsException("해당 방식으로 접근할 수 없는 아이디입니다.");
        }

        if (!passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        if (user.getDeleteAt() != null) {
            throw new BadCredentialsException("이미 탈퇴된 계정입니다.");
        }

        return Optional.of(user);
    }

    @Transactional(readOnly = true)
    public Optional<UserEntity> getUserByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId);
    }

    @Transactional
    public UserEntity updateUser(String loginId, UserUpdateDto userUpdateDto) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        userRepository.findByNickname(userUpdateDto.getNickname()).ifPresent(u -> {
            if (!u.getLoginId().equals(loginId)) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }
        });

        user.setNickname(userUpdateDto.getNickname());
        user.setPhoneNumber(userUpdateDto.getPhone());
        user.setAge(userUpdateDto.getAge());
        user.setBestAni(userUpdateDto.getFavoriteAni());

        return userRepository.save(user);
    }
    
    public boolean checkPassword(String loginId, String rawPassword) {
        return userRepository.findByLoginId(loginId)
                .map(user -> {
                    if (user.getSocial() != UserEntity.Social.LOCAL) return false;
                    return passwordEncoder.matches(rawPassword, user.getPassword());
                })
                .orElse(false);
    }

    @Transactional
    public void changePassword(String loginId, String newPassword) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (user.getSocial() != UserEntity.Social.LOCAL) {
            throw new IllegalArgumentException("소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void withdrawUser(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        user.setDeleteAt(LocalDateTime.now().withNano(0));
        userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public List<WishlistResponseDto> getWishlist(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return wishlistRepository.findByUserIdAndDeleteAtIsNull(user.getId())
                .stream()
                .map(wishlist -> {
                    String imgUrl = fileRepository.findFirstByTargetTypeAndTargetIdAndStatus(
                            TargetType.ANILIST, 
                            wishlist.getAnimation().getId(), 
                            File.FileStatus.ACTIVE
                    ).map(File::getS3Key).orElse(null);
                    
                    return WishlistResponseDto.from(wishlist, imgUrl);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<WishlistResponseDto> getWishlist(String loginId, String keyword, Pageable pageable) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return wishlistRepository.findByUserIdAndKeyword(user.getId(), keyword, pageable)
                .map(wishlist -> {
                    String imgUrl = fileRepository.findFirstByTargetTypeAndTargetIdAndStatus(
                            TargetType.ANILIST, 
                            wishlist.getAnimation().getId(), 
                            File.FileStatus.ACTIVE
                    ).map(File::getS3Key).orElse(null);
                    
                    return WishlistResponseDto.from(wishlist, imgUrl);
                });
    }

    @Transactional
    public void removeWishlist(String loginId, Integer aniId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        Wishlist wishlist = wishlistRepository.findByUserIdAndAnimationIdAndDeleteAtIsNull(user.getId(), aniId)
                .orElseThrow(() -> new IllegalArgumentException("찜 목록에 존재하지 않는 애니메이션입니다."));
        
        wishlist.setDeleteAt(LocalDateTime.now());
        wishlistRepository.save(wishlist);
    }
    
    @Transactional(readOnly = true)
    public Page<MyPostResponseDto> getMyPosts(String loginId, String keyword, Pageable pageable) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return freeBoardRepository.findByUserIdAndKeyword(user.getId(), keyword, pageable)
                .map(MyPostResponseDto::from);
    }
    
    @Transactional
    public void deleteMyPost(String loginId, Integer postId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        FreeBoard post = freeBoardRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        
        if (!post.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인이 작성한 글만 삭제할 수 있습니다.");
        }
        
        post.setDeleteAt(LocalDateTime.now());
        freeBoardRepository.save(post);
    }
    
    @Transactional(readOnly = true)
    public Page<MyLineResponseDto> getMyLines(String loginId, Pageable pageable) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return myFamousLineRepository.findByUserIdAndDeleteAtIsNullAndActive(user.getId().intValue(), LineStatus.accept, pageable)
                .map(line -> {
                    String imgUrl = fileRepository.findFirstByTargetTypeAndTargetIdAndStatus(
                            TargetType.LINE, 
                            line.getId(), 
                            File.FileStatus.ACTIVE
                    ).map(File::getS3Key).orElse(null);
                    
                    return MyLineResponseDto.from(line, imgUrl);
                });
    }

    @Transactional
    public void deleteMyLine(String loginId, Integer lineId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        FamousLineEntity line = myFamousLineRepository.findByIdAndUserIdAndDeleteAtIsNull(lineId, user.getId().intValue())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 명대사이거나 본인이 작성한 글이 아닙니다."));
        
        line.setDeleteAt(LocalDateTime.now());
        myFamousLineRepository.save(line);
        
        fileRepository.findByTargetTypeAndTargetIdAndStatus(TargetType.LINE, lineId, File.FileStatus.ACTIVE)
                .forEach(file -> {
                    file.setStatus(File.FileStatus.DELETED);
                    file.setDeleteAt(LocalDateTime.now());
                    fileRepository.save(file);
                });
    }
    
    @Transactional(readOnly = true)
    public Page<MyInquiryResponseDto> getMyInquiries(String loginId, Boolean status, String keyword, Pageable pageable) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return askRepository.findByUserIdAndStatusAndKeyword(user.getId(), status, keyword, pageable)
                .map(MyInquiryResponseDto::from);
    }

    @Transactional
    public void deleteMyInquiry(String loginId, Integer inquiryId) {
        UserEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        Ask ask = askRepository.findByIdAndUserIdAndDeleteAtIsNull(inquiryId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의사항이거나 본인이 작성한 글이 아닙니다."));
        
        ask.setDeleteAt(LocalDateTime.now());
        askRepository.save(ask);
    }

    public boolean checkLoginIdDuplicate(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }

    public boolean checkNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}
