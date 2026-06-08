package com.itcen.emergencyroad.auth.service;

import com.itcen.emergencyroad.auth.dto.UpdateUserRequestDto;
import com.itcen.emergencyroad.auth.dto.UserResponseDto;
import com.itcen.emergencyroad.community.entity.User;
import com.itcen.emergencyroad.community.repository.UserRepository;
import com.itcen.emergencyroad.community.service.ProfileImageService;
import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final ProfileImageService profileImageService;

  @Transactional(readOnly = true)
  public UserResponseDto getUser(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
    return UserResponseDto.from(user);
  }

  @Transactional
  public void updateUser(Long userId, UpdateUserRequestDto dto, MultipartFile profileImage) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

    if (dto.getNickname() != null && !dto.getNickname().isBlank()) {
      if (!dto.getNickname().equals(user.getNickname()) &&
          userRepository.existsByNickname(dto.getNickname())) {
        throw new CustomException(ExceptionStatus.DUPLICATED_NICKNAME);
      }
      user.updateNickname(dto.getNickname());
    }

    if (profileImage != null && !profileImage.isEmpty()) {
      String imageUrl = profileImageService.uploadProfileImage(profileImage);
      user.updateProfileImage(imageUrl);
    }
  }
}
